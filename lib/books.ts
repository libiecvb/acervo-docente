import booksData from '@/data/books.json'
import { searchBooks as upstashSearchBooks, SearchResult } from '@/lib/search'

export interface Book {
  id: string
  titulo: string
  autor: string
  resumo: string
  principais_topicos: string
  link: string
}

export const books = booksData as Book[]

export function getTopics(book: Book): string[] {
  return book.principais_topicos
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

/**
 * Busca local em memória (fallback se Upstash indisponível)
 */
export function searchBooksLocal(query: string): Book[] {
  const q = query.trim().toLowerCase()
  if (!q) return books

  const terms = q.split(/\s+/)
  return books.filter((book) => {
    const haystack = (
      book.titulo +
      ' ' +
      book.autor +
      ' ' +
      book.principais_topicos +
      ' ' +
      book.resumo
    ).toLowerCase()
    return terms.every((term) => haystack.includes(term))
  })
}

/**
 * Busca híbrida: tenta Upstash Search primeiro, cai para busca local se falhar
 */
export async function searchBooks(query: string): Promise<Book[]> {
  try {
    const results = await upstashSearchBooks(query, { topK: 100 })
    return results.map((r) => ({
      id: r.id,
      titulo: r.titulo,
      autor: r.autor,
      resumo: r.resumo,
      principais_topicos: r.principais_topicos,
      link: r.link,
    }))
  } catch (error) {
    console.warn('[Search] Upstash indisponível, usando fallback local:', error)
    return searchBooksLocal(query)
  }
}

export function getBookById(id: string): Book | undefined {
  return books.find((b) => b.id === id)
}