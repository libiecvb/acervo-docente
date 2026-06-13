import { type NextRequest, NextResponse } from "next/server"
import { getDiverseRandomBooks } from "@/lib/random-books"

export const dynamic = "force-dynamic"
export const revalidate = 0 // Sem cache no edge

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