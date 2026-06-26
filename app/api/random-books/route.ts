import { type NextRequest, NextResponse } from "next/server"
import { getDiverseRandomBooks } from "@/lib/random-books"

export const dynamic = "force-dynamic"
export const revalidate = 0 // Sem cache no edge

/**
 * GET /api/random-books - Get diverse random books.
 *
 * @remarks
 * Returns a selection of random books with topic diversity guaranteed.
 * Uses {@link getDiverseRandomBooks} internally to ensure variety across topics.
 * The `seed` parameter is accepted for client-side cache busting but does not affect server-side randomness.
 *
 * @param request - Next.js request object with search params:
 *   - `count` (number): Number of books to return, 1-50 (default: 10)
 *   - `seed` (string): Optional cache-busting seed (ignored by server)
 * @returns JSON response with books array, timestamp, and seed
 *
 * @example Response:
 * ```json
 * {
 *   "books": [{ "id": "1", "titulo": "...", ... }],
 *   "timestamp": "2026-06-15T12:00:00.000Z",
 *   "seed": "1718452800000"
 * }
 * ```
 *
 * @public
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const count = Math.min(Math.max(Number(searchParams.get("count")) || 10, 1), 50)
  const seed = searchParams.get("seed") // Usado apenas para bust cache client-side

  try {
    const books = getDiverseRandomBooks(count)
    return NextResponse.json({
      books,
      timestamp: new Date().toISOString(),
      seed: seed ?? Date.now()
    })
  } catch (error) {
    console.error("[API /random-books] Error:", error)
    return NextResponse.json(
      { error: "Erro ao buscar livros aleatórios", books: [] },
      { status: 500 }
    )
  }
}