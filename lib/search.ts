import { Search } from '@upstash/search'
import type { Book } from '@/lib/books'

// Cliente Upstash Search - o nome do índice vem da URL: loving-possum-40689-gcp-usc1-search.upstash.io
const INDEX_NAME = 'loving-possum-40689'

// Inicialização lazy para evitar erro "UPSTASH_SEARCH_REST_TOKEN is missing!"
// durante avaliação do módulo (build time)
let _searchIndex: ReturnType<Search['index']> | null = null

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

export const searchIndex = {
  search: (params: Parameters<ReturnType<Search['index']>['search']>[0]) =>
    getSearchIndex().search(params),
  info: () => getSearchIndex().info(),
  upsert: (params: Parameters<ReturnType<Search['index']>['upsert']>[0]) =>
    getSearchIndex().upsert(params),
  fetch: (params: Parameters<ReturnType<Search['index']>['fetch']>[0]) =>
    getSearchIndex().fetch(params),
  delete: (params: Parameters<ReturnType<Search['index']>['delete']>[0]) =>
    getSearchIndex().delete(params),
  range: (params: Parameters<ReturnType<Search['index']>['range']>[0]) =>
    getSearchIndex().range(params),
  reset: () => getSearchIndex().reset(),
  deleteIndex: () => getSearchIndex().deleteIndex(),
}

export interface SearchResult {
  id: string
  titulo: string
  autor: string
  resumo: string
  principais_topicos: string
  link: string
  search_text: string
  topics_array: string[]
  autor_normalized: string
  score: number
}

/**
 * Busca híbrida no Upstash Search (full-text + semantic)
 * Combina BM25 (full-text) com similaridade de vetores (semântica)
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
      reranking: true, // ↑ Ativar reranking (melhora precisão)
      inputEnrichment: true,     // ↑ Desativar expansão automática
      keepOriginalQueryAfterEnrichment: true,
    })

    return results.map((r) => {
      // content vem como {text: "..."} do armazenamento
      const contentText = typeof r.content === 'string' ? r.content : r.content?.text ?? ''
      return {
        id: r.id,
        titulo: r.metadata?.titulo ?? '',
        autor: r.metadata?.autor ?? '',
        resumo: r.metadata?.resumo ?? '',
        principais_topicos: r.metadata?.principais_topicos ?? '',
        link: r.metadata?.link ?? '',
        search_text: contentText,
        topics_array: r.metadata?.topics_array ?? [],
        autor_normalized: r.metadata?.autor_normalized ?? '',
        score: r.score ?? 0,
      }
    })
  } catch (error) {
    console.error('[Upstash Search] Erro na busca:', error)
    throw error
  }
}

/**
 * Busca com filtro por tópico específico
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
 * Busca por autor (exato ou parcial)
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
 * Verifica se o índice está acessível
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
 * Conta total de documentos no índice
 */
export async function getIndexStats(): Promise<{ count: number } | null> {
  try {
    const info = await searchIndex.info()
    return { count: info.documentCount ?? 0 }
  } catch {
    return null
  }
}