import { z } from "zod"
import booksData from "@/data/books.json"
import { searchBooks as upstashSearchBooks, SearchResult } from "@/lib/search"

/**
 * Zod schema for Book validation.
 *
 * @remarks
 * Validates book data structure at runtime.
 * Lenient validation to accommodate existing data variations.
 * Use validateBook() for strict validation of new entries.
 *
 * @public
 */
const BookSchema = z.object({
  /** Unique identifier */
  id: z.string().regex(/^\d+$/, "ID must be numeric"),
  /** Book title */
  titulo: z.string().min(1, "Title is required"),
  /** Author name */
  autor: z.string().optional().default(""),
  /** Book summary/description */
  resumo: z.string().default(""),
  /** Comma-separated topics */
  principais_topicos: z.string().default(""),
  /** External link */
  link: z.string().default(""),
})

/**
 * Strict schema for validating new book entries.
 *
 * @public
 */
export const StrictBookSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be numeric"),
  titulo: z.string().min(1, "Title is required").max(200, "Title too long"),
  autor: z.string().min(1, "Author is required").max(100, "Author name too long"),
  resumo: z.string().min(50, "Summary too short").max(5000, "Summary too long"),
  principais_topicos: z.string(),
  link: z.string().url("Must be a valid URL").refine(
    (url) => url.includes("drive.google.com") || url.includes("http"),
    "Link should point to Google Drive"
  ),
})

/**
 * Represents a book in the catalog.
 *
 * @public
 */
export interface Book {
  /** Unique identifier for the book */
  id: string
  /** Book title */
  titulo: string
  /** Author name */
  autor: string
  /** Book summary/description */
  resumo: string
  /** Comma-separated list of main topics */
  principais_topicos: string
  /** External link to the book */
  link: string
}

/**
 * Parsed and validated book data.
 * @remarks Uses lenient schema for existing data compatibility.
 */
export const books: Book[] = BookSchema.array().parse(booksData)

/**
 * Extracts and normalizes topics from a book.
 *
 * @remarks
 * Splits the comma-separated `principais_topicos` field,
 * trims whitespace, and filters out empty entries.
 *
 * @param book - The book to extract topics from
 * @returns Array of cleaned topic strings
 *
 * @example
 * ```typescript
 * const book = { principais_topicos: "React, TypeScript,  , Next.js" }
 * getTopics(book) // ["React", "TypeScript", "Next.js"]
 * ```
 *
 * @public
 */
export function getTopics(book: Book): string[] {
  return book.principais_topicos
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
}

/**
 * Performs a local in-memory search as a fallback when Upstash is unavailable.
 *
 * @remarks
 * Searches across title, author, topics, and summary fields.
 * All search terms must match (AND logic) for a book to be returned.
 * Case-insensitive.
 *
 * @param query - Search query string
 * @returns Array of matching books (empty query returns all books)
 *
 * @public
 */
export function searchBooksLocal(query: string): Book[] {
  const q = query.trim().toLowerCase()
  if (!q) return books

  const terms = q.split(/\s+/)
  return books.filter((book) => {
    const haystack = (
      book.titulo +
      " " +
      book.autor +
      " " +
      book.principais_topicos +
      " " +
      book.resumo
    ).toLowerCase()
    return terms.every((term) => haystack.includes(term))
  })
}

/**
 * Validates a book object using strict schema.
 *
 * @param book - Book to validate
 * @returns Parsed book if valid, throws ZodError otherwise
 *
 * @public
 */
export function validateBook(book: unknown): Book {
  return StrictBookSchema.parse(book)
}

/**
 * Validates book data array using strict schema.
 *
 * @param books - Array to validate
 * @returns Tuple of [validBooks, errors] where errors is empty if all valid
 *
 * @public
 */
export function validateBooks(books: unknown[]): [Book[], string[]] {
  const validBooks: Book[] = []
  const errors: string[] = []

  for (const [index, book] of books.entries()) {
    try {
      validBooks.push(StrictBookSchema.parse(book))
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(`Book ${index}: ${error.issues.map((e) => e.message).join(", ")}`)
      }
    }
  }

  return [validBooks, errors]
}

/**
 * Hybrid search: tries Upstash Search first, falls back to local search on failure.
 *
 * @remarks
 * Attempts to use Upstash Search (full-text + semantic) for better relevance.
 * If Upstash is unavailable (network error, missing credentials, etc.),
 * gracefully falls back to `searchBooksLocal`.
 * Logs a warning to console when fallback is triggered.
 *
 * @param query - Search query string
 * @returns Promise resolving to array of matching books
 *
 * @throws Propagates errors from Upstash Search if not a network/availability issue
 *
 * @public
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
    console.warn("[Search] Upstash indisponível, usando fallback local:", error)
    return searchBooksLocal(query)
  }
}

/**
 * Retrieves a book by its unique ID.
 *
 * @param id - The book's unique identifier
 * @returns The book if found, `undefined` otherwise
 *
 * @public
 */
export function getBookById(id: string): Book | undefined {
  return books.find((b) => b.id === id)
}
