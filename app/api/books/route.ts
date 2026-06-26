import { type NextRequest, NextResponse } from 'next/server'
import { searchBooks } from '@/lib/search'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 24

type ErrorCode = 'UPSTASH_UNAVAILABLE' | 'RATE_LIMITED' | 'NETWORK_ERROR' | 'INTERNAL_ERROR'

interface ErrorResponse {
  error: string
  code: ErrorCode
  retryable: boolean
  items: never[]
  total: 0
  page: 1
  hasMore: false
}

function handleSearchError(error: unknown): ErrorResponse {
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes('credentials not configured') || message.includes('UPSTASH') || message.includes('Search credentials')) {
    return {
      error: 'Serviço de busca temporariamente indisponível',
      code: 'UPSTASH_UNAVAILABLE',
      retryable: true,
      items: [],
      total: 0,
      page: 1,
      hasMore: false,
    }
  }

  if (message.includes('429') || message.includes('rate limit') || message.includes('Too Many Requests')) {
    return {
      error: 'Muitas requisições. Aguarde um momento.',
      code: 'RATE_LIMITED',
      retryable: true,
      items: [],
      total: 0,
      page: 1,
      hasMore: false,
    }
  }

  if (message.includes('network') || message.includes('timeout') || message.includes('fetch') || message.includes('ECONNREFUSED') || message.includes('ETIMEDOUT')) {
    return {
      error: 'Problema de conexão. Verifique sua internet.',
      code: 'NETWORK_ERROR',
      retryable: true,
      items: [],
      total: 0,
      page: 1,
      hasMore: false,
    }
  }

  return {
    error: 'Erro interno do servidor. Tente novamente.',
    code: 'INTERNAL_ERROR',
    retryable: true,
    items: [],
    total: 0,
    page: 1,
    hasMore: false,
  }
}

/**
 * GET /api/books - Search books with pagination.
 *
 * @remarks
 * Searches the catalog using Upstash Search (full-text + semantic).
 * Returns paginated results with metadata for client-side pagination controls.
 * On error, returns typed error response with code and retry information.
 *
 * @param request - Next.js request object with search params:
 *   - `q` (string): Search query (optional, empty returns empty)
 *   - `page` (number): Page number, 1-indexed (default: 1)
 * @returns JSON response with items, total count, current page, and hasMore flag
 *
 * @example Success Response:
 * ```json
 * {
 *   "items": [{ "id": "1", "titulo": "...", ... }],
 *   "total": 150,
 *   "page": 1,
 *   "hasMore": true
 * }
 * ```
 *
 * @example Error Response:
 * ```json
 * {
 *   "error": "Serviço de busca temporariamente indisponível",
 *   "code": "UPSTASH_UNAVAILABLE",
 *   "retryable": true,
 *   "items": [],
 *   "total": 0,
 *   "page": 1,
 *   "hasMore": false
 * }
 * ```
 *
 * @public
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') ?? ''
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)

  try {
    const results = await searchBooks(query, { topK: 100 })
    const total = results.length
    const start = (page - 1) * PAGE_SIZE
    const items = results.slice(start, start + PAGE_SIZE)
    const hasMore = start + PAGE_SIZE < total

    return NextResponse.json({ items, total, page, hasMore })
  } catch (error) {
    console.error('[API /books] Erro:', error)
    const errorResponse = handleSearchError(error)
    return NextResponse.json(
      errorResponse,
      { status: errorResponse.retryable ? 503 : 500 }
    )
  }
}