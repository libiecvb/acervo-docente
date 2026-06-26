# Types Reference

Interfaces e tipos TypeScript exportados pelo Acervo Docente.

## Book

Representa um livro no catálogo.

```typescript
interface Book {
  /** Unique identifier */
  id: string
  /** Book title */
  titulo: string
  /** Author name */
  autor: string
  /** Book summary/description */
  resumo: string
  /** Comma-separated list of main topics */
  principais_topicos: string
  /** External link (Google Drive) */
  link: string
}
```

### Localização

`lib/books.ts` — exportado como `Book`

### Exemplo

```typescript
import type { Book } from '@/lib/books'

const livro: Book = {
  id: "123",
  titulo: "Aperite, Filho da Mãe!",
  autor: "Augusto Cury",
  resumo: "Um livro sobre psicologia...",
  principais_topicos: "Psicologia, Autoconhecimento, Filosofia",
  link: "https://drive.google.com/file/d/..."
}
```

---

## SearchResult

Resultado da busca no Upstash Search.

```typescript
interface SearchResult {
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
```

### Localização

`lib/search.ts` — exportado como `SearchResult`

### Relação com Book

```typescript
// SearchResult estende Book com metadados extras
export interface SearchResult extends Book {
  search_text: string
  topics_array: string[]
  autor_normalized: string
  score: number
}
```

---

## ApiResponse

Resposta da API `/api/books`.

```typescript
interface ApiResponse {
  /** Array of books */
  items: Book[]
  /** Total matching results */
  total: number
  /** Current page number (1-indexed) */
  page: number
  /** Whether more pages exist */
  hasMore: boolean
}
```

### Localização

`components/book-catalog.tsx`

### Exemplo

```json
{
  "items": [{ "id": "1", "titulo": "...", ... }],
  "total": 150,
  "page": 1,
  "hasMore": true
}
```

---

## BookCatalogProps

Props do componente BookCatalog.

```typescript
interface BookCatalogProps {
  /** Initial total book count */
  initialTotal: number
  /** Optional initial search query */
  initialQuery?: string
}
```

---

## SiteHeaderProps

Props do componente SiteHeader.

```typescript
interface SiteHeaderProps {
  /** Total number of books in catalog */
  total: number
}
```

---

## Funções Exportadas

### getTopics

```typescript
/**
 * Extracts and normalizes topics from a book.
 */
export function getTopics(book: Book): string[]
```

### searchBooksLocal

```typescript
/**
 * Local in-memory search (AND logic).
 */
export function searchBooksLocal(query: string): Book[]
```

### searchBooks

```typescript
/**
 * Hybrid search: Upstash + local fallback.
 */
export async function searchBooks(query: string): Promise<Book[]>
```

### getBookById

```typescript
/**
 * Retrieves a book by its ID.
 */
export function getBookById(id: string): Book | undefined
```

## Referências

- [API Reference](./api/books.md)
- [Componentes](./components/)