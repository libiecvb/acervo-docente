import { type NextRequest, NextResponse } from 'next/server'
import { searchBooks } from '@/lib/books'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 24

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') ?? ''
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)

  try {
    const results = await searchBooks(query)
    const total = results.length
    const start = (page - 1) * PAGE_SIZE
    const items = results.slice(start, start + PAGE_SIZE)
    const hasMore = start + PAGE_SIZE < total

    return NextResponse.json({ items, total, page, hasMore })
  } catch (error) {
    console.error('[API /books] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar livros', items: [], total: 0, page: 1, hasMore: false },
      { status: 500 }
    )
  }
}