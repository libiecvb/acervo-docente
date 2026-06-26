import { describe, it, expect } from "vitest"
import { validateBook, validateBooks, StrictBookSchema } from "@/lib/books"

describe("lib/books.ts - Validation Tests", () => {
  describe("validateBook()", () => {
    it("should validate a valid book object", () => {
      const validBook = {
        id: "123",
        titulo: "Test Book Title",
        autor: "Test Author",
        resumo: "This is a valid summary with at least fifty characters.",
        principais_topicos: "Topic A, Topic B",
        link: "https://drive.google.com/file/d/test/view",
      }
      const result = validateBook(validBook)
      expect(result).toEqual(validBook)
    })

    it("should throw on missing required fields", () => {
      const invalidBook = {
        id: "123",
        titulo: "", // empty title
      }
      expect(() => validateBook(invalidBook)).toThrow()
    })

    it("should throw on id with non-numeric characters", () => {
      const invalidBook = {
        id: "abc", // not numeric
        titulo: "Test Book",
        autor: "Test Author",
        resumo: "Valid summary with enough characters here.",
        principais_topicos: "",
        link: "https://drive.google.com/file/d/test/view",
      }
      expect(() => validateBook(invalidBook)).toThrow()
    })

    it("should throw on title exceeding 200 characters", () => {
      const invalidBook = {
        id: "123",
        titulo: "A".repeat(201),
        autor: "Test Author",
        resumo: "Valid summary with enough characters here.",
        principais_topicos: "",
        link: "https://drive.google.com/file/d/test/view",
      }
      expect(() => validateBook(invalidBook)).toThrow()
    })

    it("should throw on author exceeding 100 characters", () => {
      const invalidBook = {
        id: "123",
        titulo: "Test Book",
        autor: "A".repeat(101),
        resumo: "Valid summary with enough characters here.",
        principais_topicos: "",
        link: "https://drive.google.com/file/d/test/view",
      }
      expect(() => validateBook(invalidBook)).toThrow()
    })

    it("should throw on summary below 50 characters", () => {
      const invalidBook = {
        id: "123",
        titulo: "Test Book",
        autor: "Test Author",
        resumo: "Too short", // less than 50 chars
        principais_topicos: "",
        link: "https://drive.google.com/file/d/test/view",
      }
      expect(() => validateBook(invalidBook)).toThrow()
    })

    it("should throw on invalid URL", () => {
      const invalidBook = {
        id: "123",
        titulo: "Test Book",
        autor: "Test Author",
        resumo: "Valid summary with enough characters here.",
        principais_topicos: "",
        link: "not-a-valid-url",
      }
      expect(() => validateBook(invalidBook)).toThrow()
    })
  })

  describe("validateBooks()", () => {
    it("should validate array of valid books", () => {
      const validBooks = [
        {
          id: "1",
          titulo: "First Book",
          autor: "Author One",
          resumo: "Summary for first book with enough characters here.",
          principais_topicos: "Topic A",
          link: "https://drive.google.com/file/d/1/view",
        },
        {
          id: "2",
          titulo: "Second Book",
          autor: "Author Two",
          resumo: "Summary for second book with enough characters here.",
          principais_topicos: "Topic B",
          link: "https://drive.google.com/file/d/2/view",
        },
      ]
      const [result, errors] = validateBooks(validBooks)
      expect(result).toHaveLength(2)
      expect(errors).toHaveLength(0)
    })

    it("should return errors for invalid books and valid ones separately", () => {
      const mixedBooks = [
        {
          id: "1",
          titulo: "Valid Book",
          autor: "Author One",
          resumo: "This is a valid summary with enough characters for validation.",
          principais_topicos: "",
          link: "https://drive.google.com/file/d/1/view",
        },
        {
          id: "invalid",
          titulo: "",
          autor: "Author",
          resumo: "Too short",
          principais_topicos: "",
          link: "bad-url",
        },
        {
          id: "2",
          titulo: "Another Valid Book",
          autor: "Author Two",
          resumo: "This is another valid summary with enough length for checks.",
          principais_topicos: "",
          link: "https://drive.google.com/file/d/2/view",
        },
      ]
      const [result, errors] = validateBooks(mixedBooks)
      expect(result).toHaveLength(2)
      expect(errors).toHaveLength(1)
      expect(errors[0]).toContain("Book 1:")
    })

    it("should handle empty array", () => {
      const [result, errors] = validateBooks([])
      expect(result).toHaveLength(0)
      expect(errors).toHaveLength(0)
    })
  })

  describe("StrictBookSchema", () => {
    it("should have correct min constraints", () => {
      expect(StrictBookSchema.shape.titulo.minLength).toBe(1)
      expect(StrictBookSchema.shape.resumo.minLength).toBe(50)
    })

    it("should have correct max constraints", () => {
      expect(StrictBookSchema.shape.titulo.maxLength).toBe(200)
      expect(StrictBookSchema.shape.autor.maxLength).toBe(100)
    })
  })
})