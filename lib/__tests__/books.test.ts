import { describe, it, expect, vi } from "vitest"
import { getTopics, searchBooksLocal, getBookById } from "@/lib/books"
import type { Book } from "@/lib/books"

const mockBooks = vi.hoisted(() => [
  {
    id: "1",
    titulo: "Alpha Book",
    autor: "Alpha Author",
    resumo: "Unique summary for alpha book that will not match beta",
    principais_topicos: "Alpha Topic, Beta Topic, Gamma Topic",
    link: "https://drive.google.com/file/d/alpha/view",
  },
  {
    id: "2",
    titulo: "Beta Book",
    autor: "Beta Author",
    resumo: "Different summary for beta book that is unique",
    principais_topicos: "Delta Subject, Epsilon Subject",
    link: "https://drive.google.com/file/d/beta/view",
  },
])

vi.mock("@/lib/books", () => {
  const mockBooksArray = [...mockBooks]

  function getTopicsFn(book: Book): string[] {
    return book.principais_topicos
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  }

  function searchBooksLocalFn(query: string): Book[] {
    const q = query.trim().toLowerCase()
    if (!q) return mockBooksArray

    const terms = q.split(/\s+/)
    return mockBooksArray.filter((book) => {
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

  function getBookByIdFn(id: string): Book | undefined {
    return mockBooksArray.find((b) => b.id === id)
  }

  return {
    getTopics: getTopicsFn,
    searchBooksLocal: searchBooksLocalFn,
    getBookById: getBookByIdFn,
  }
})

describe("lib/books.ts - Unit Tests", () => {
  describe("getTopics()", () => {
    it("should parse comma-separated topics and trim whitespace", () => {
      const result = getTopics(mockBooks[0] as Book)
      expect(result).toEqual(["Alpha Topic", "Beta Topic", "Gamma Topic"])
    })

    it("should filter out empty entries", () => {
      const book = { ...mockBooks[0], principais_topicos: "Topic 1,, , Topic 2" } as Book
      const result = getTopics(book)
      expect(result).toEqual(["Topic 1", "Topic 2"])
    })

    it("should return empty array for empty string", () => {
      const book = { ...mockBooks[0], principais_topicos: "" } as Book
      const result = getTopics(book)
      expect(result).toEqual([])
    })

    it("should handle single topic without commas", () => {
      const book = { ...mockBooks[0], principais_topicos: "Single Topic" } as Book
      const result = getTopics(book)
      expect(result).toEqual(["Single Topic"])
    })
  })

  describe("searchBooksLocal()", () => {
    it("should return all books for empty query", () => {
      const result = searchBooksLocal("")
      expect(result).toHaveLength(2)
    })

    it("should return all books for whitespace-only query", () => {
      const result = searchBooksLocal("   ")
      expect(result).toHaveLength(2)
    })

    it("should find book by title (case-insensitive)", () => {
      const result = searchBooksLocal("alpha book")
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("1")
    })

    it("should find book by author (case-insensitive)", () => {
      const result = searchBooksLocal("alpha author")
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("1")
    })

    it("should find book by topic", () => {
      const result = searchBooksLocal("alpha topic")
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("1")
    })

    it("should find book by summary content", () => {
      const result = searchBooksLocal("unique summary for alpha")
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("1")
    })

    it("should return empty array for non-matching query", () => {
      const result = searchBooksLocal("nonexistent")
      expect(result).toHaveLength(0)
    })

    it("should require ALL terms to match (AND logic)", () => {
      const result = searchBooksLocal("alpha topic")
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("1")
    })

    it("should return empty when one term matches but other doesnt", () => {
      const result = searchBooksLocal("alpha nonexistent")
      expect(result).toHaveLength(0)
    })
  })

  describe("getBookById()", () => {
    it("should return book when found", () => {
      const result = getBookById("1")
      expect(result).toEqual(mockBooks[0])
    })

    it("should return undefined when not found", () => {
      const result = getBookById("999")
      expect(result).toBeUndefined()
    })
  })
})