import { Search } from '@upstash/search'
import type { Book } from '@/lib/books'

// Upstash Search result metadata shape (not exported by SDK)
interface SearchMetadata {
  titulo: string
  autor: string
  resumo: string
  principais_topicos: string
  link: string
  topics_array: string[]
  autor_normalized: string
}

// Upstash Search result content shape
interface SearchContent {
  text: string
}

// Cliente Upstash Search - o nome do índice vem da URL: loving-possum-40689-gcp-usc1-search.upstash.io
const INDEX_NAME = 'loving-possum-40689'

// Inicialização lazy para evitar erro "UPSTASH_SEARCH_REST_TOKEN is missing!"
// durante avaliação do módulo (build time)
let _searchIndex: ReturnType<Search['index']> | null = null

/**
 * Lazily initializes and returns the Upstash Search index client.
 *
 * @remarks
 * Uses lazy initialization to avoid build-time errors when environment
 * variables are not available. Throws if credentials are missing at runtime.
 *
 * @returns The Upstash Search index instance
 * @throws {Error} If UPSTASH_SEARCH_REST_URL or UPSTASH_SEARCH_REST_TOKEN are not configured
 *
 * @internal
 */
function getSearchIndex() {
  if (!_searchIndex) {
    const url = process.env.UPSTASH_SEARCH_REST_URL
    const token = process.env.UPSTASH_SEARCH_REST_TOKEN

    if (!url || !token) {
      throw new Error(
        'Upstash Search credentials not configured. ' +
        'Check UPSTASH_SEARCH_REST_URL and UPSTASH_SEARCH_REST_TOKEN in .env.local'
      )
    }

    const search = new Search({ url, token })
    _searchIndex = search.index(INDEX_NAME)
  }
  return _searchIndex
}

/**
 * Upstash Search index proxy with lazy initialization.
 *
 * @remarks
 * Provides a typed interface to the Upstash Search index.
 * All methods delegate to the underlying index with lazy initialization.
 *
 * @public
 */
export const searchIndex = {
  /** Performs a search query */
  search: (params: Parameters<ReturnType<Search['index']>['search']>[0]) =>
    getSearchIndex().search(params),
  /** Retrieves index information */
  info: () => getSearchIndex().info(),
  /** Inserts or updates documents */
  upsert: (params: Parameters<ReturnType<Search['index']>['upsert']>[0]) =>
    getSearchIndex().upsert(params),
  /** Fetches documents by ID */
  fetch: (params: Parameters<ReturnType<Search['index']>['fetch']>[0]) =>
    getSearchIndex().fetch(params),
  /** Deletes documents by ID */
  delete: (params: Parameters<ReturnType<Search['index']>['delete']>[0]) =>
    getSearchIndex().delete(params),
  /** Retrieves documents in a range */
  range: (params: Parameters<ReturnType<Search['index']>['range']>[0]) =>
    getSearchIndex().range(params),
  /** Resets the index (removes all documents) */
  reset: () => getSearchIndex().reset(),
  /** Deletes the entire index */
  deleteIndex: () => getSearchIndex().deleteIndex(),
}

/**
 * Represents a search result from Upstash Search.
 *
 * @public
 */
export interface SearchResult {
  /** Unique document identifier */
  id: string
  /** Book title */
  titulo: string
  /** Author name */
  autor: string
  /** Book summary */
  resumo: string
  /** Comma-separated main topics */
  principais_topicos: string
  /** External link */
  link: string
  /** Full searchable text content */
  search_text: string
  /** Parsed topics array */
  topics_array: string[]
  /** Normalized author name for searching */
  autor_normalized: string
  /** Relevance score (higher = more relevant) */
  score: number
}

/**
 * Performs a hybrid search on Upstash Search (full-text + semantic).
 *
 * @remarks
 * Combines BM25 (full-text) with vector similarity (semantic).
 * Default configuration uses semantic weight of 0.5, reranking enabled,
 * and input enrichment for better recall.
 *
 * @param query - Search query string
 * @param options - Search configuration options
 * @param options.topK - Maximum number of results (default: 20, capped by internal limit)
 * @param options.filter - Upstash filter expression (e.g., "topics_array CONTAINS 'React'")
 * @param options.semanticWeight - Semantic vs full-text weight 0-1 (default: 0.5)
 * @param options.reranking - Enable result reranking for precision (default: true)
 * @returns Promise resolving to array of search results with relevance scores
 *
 * @throws {Error} Propagates Upstash Search errors (network, auth, etc.)
 *
 * @example
 * ```typescript
 * // Basic search
 * const results = await searchBooks('React hooks')
 *
 * // Search with topic filter
 * const results = await searchBooks('hooks', {
 *   filter: "topics_array CONTAINS 'React'",
 *   topK: 10
 * })
 * ```
 *
 * @public
 */
export async function searchBooks(
  query: string,
  options?: {
    topK?: number
    filter?: string
    semanticWeight?: number
    reranking?: boolean
  }
): Promise<SearchResult[]> {
  const q = query.trim()
  if (!q) return []

  try {
    const results = await searchIndex.search({
      query: q,
      limit: 20,
      filter: options?.filter,
      semanticWeight: 0.5, // ↓ Reduzir: mais full-text, menos semântico
      reranking: false, // ↑ Ativar reranking (melhora precisão)
      inputEnrichment: true,     // ↑ Desativar expansão automática
      keepOriginalQueryAfterEnrichment: true,
    })

    return results.map((r) => {
      // content vem como {text: "..."} do armazenamento
      const content = r.content as unknown as SearchContent | string | undefined
      const contentText = typeof content === 'string' ? content : content?.text ?? ''
      const metadata = r.metadata as unknown as SearchMetadata | undefined
      return {
        id: r.id,
        titulo: metadata?.titulo ?? '',
        autor: metadata?.autor ?? '',
        resumo: metadata?.resumo ?? '',
        principais_topicos: metadata?.principais_topicos ?? '',
        link: metadata?.link ?? '',
        search_text: contentText,
        topics_array: metadata?.topics_array ?? [],
        autor_normalized: metadata?.autor_normalized ?? '',
        score: r.score ?? 0,
      }
    })
  } catch (error) {
    console.error('[Upstash Search] Erro na busca:', error)
    throw error
  }
}

/**
 * Searches books filtered by a specific topic.
 *
 * @remarks
 * Uses the `topics_array` field with a CONTAINS filter for exact topic matching.
 * Internally calls {@link searchBooks} with a topic filter.
 *
 * @param query - Search query string
 * @param topic - Topic to filter by (must match a value in topics_array)
 * @param topK - Maximum results (default: 20)
 * @returns Promise resolving to filtered search results
 *
 * @public
 */
export async function searchBooksByTopic(
  query: string,
  topic: string,
  topK = 20
): Promise<SearchResult[]> {
  return searchBooks(query, {
    topK,
    filter: `topics_array CONTAINS '${topic}'`,
  })
}

/**
 * Searches books by author name.
 *
 * @remarks
 * Normalizes the author name (lowercase, NFD unicode normalization, removes diacritics)
 * and searches against the `autor_normalized` field using a CONTAINS filter.
 * This enables accent-insensitive author search.
 *
 * @param author - Author name to search for (partial matches supported)
 * @param topK - Maximum results (default: 20)
 * @returns Promise resolving to search results matching the author
 *
 * @public
 */
export async function searchBooksByAuthor(
  author: string,
  topK = 20
): Promise<SearchResult[]> {
  const normalized = author.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  return searchBooks(normalized, {
    topK,
    filter: `autor_normalized CONTAINS '${normalized}'`,
  })
}

/**
 * Checks if the Upstash Search index is accessible.
 *
 * @remarks
 * Performs a lightweight test search to verify connectivity and credentials.
 * Does not validate index contents, only accessibility.
 *
 * @returns Promise resolving to `true` if accessible, `false` otherwise
 *
 * @public
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await searchIndex.search({ query: 'teste', limit: 1 })
    return true
  } catch {
    return false
  }
}

/**
 * Retrieves index statistics (document count).
 *
 * @remarks
 * Calls the Upstash Search info endpoint to get the document count.
 * Returns `null` if the index is inaccessible or an error occurs.
 *
 * @returns Promise resolving to object with count, or `null` on error
 *
 * @public
 */
export async function getIndexStats(): Promise<{ count: number } | null> {
  try {
    const info = await searchIndex.info()
    return { count: info.documentCount ?? 0 }
  } catch {
    return null
  }
}