# Componentes App

Componentes principais da aplicação.

## BookCard

`<BookCard />` — Card individual de livro com ações.

### Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `book` | `Book` | Sim | Objeto livro a ser exibido |

### Features

- **Expansível** — Mostra/oculta resumo completo
- **Copy** — Copia `título — autor\n\nresumo` para clipboard
- **Link externo** — Abre Google Drive em nova aba
- **Tópicos** — Badges dos `principais_topicos`
- **Metadata** — Exibe `ID: #N`

### States

| State | Visual | Comportamento |
|-------|--------|---------------|
| Default | Resumo com `line-clamp-3` | Mostra "Ver resumo" button |
| Expanded | Resumo completo + badges | Mostra "Recolher" button |
| Copied | Ícone Check verde | Feedback visual 2s |

### Exemplo

```tsx
import { BookCard } from '@/components/book-card'
import type { Book } from '@/lib/books'

export function BookList({ books }: { books: Book[] }) {
  return (
    <div className="grid gap-x-10 md:grid-cols-2">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}
```

---

## BookCatalog

`<BookCatalog />` — Catálogo com busca, paginação e infinite scroll.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `initialTotal` | `number` | - | Total inicial de livros |
| `initialQuery` | `string` | `""` | Query de busca inicial |

### Features

- **Debounce** — 300ms via hook custom
- **Paginação** — Server-side via API
- **Accumulated** — Resultados são acumulados ao clicar "Carregar mais"
- **Skeleton** — 6 placeholders no primeiro load
- **Empty state** — Mensagem quando sem resultados

### States

| State | Comportamento |
|-------|---------------|
| Loading (initial) | Skeleton grid visível |
| Loading (pagination) | Spinner no botão |
| Empty | Mensagem "Nenhum livro encontrado" |
| Error | Console.error + fallback local |

### Exemplo

```tsx
import { BookCatalog } from '@/components/book-catalog'

export function Page() {
  return (
    <main>
      <BookCatalog initialTotal={482} initialQuery="Sabedoria" />
    </main>
  )
}
```

---

## SiteHeader

`<SiteHeader />` — Header com título e contador.

### Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `total` | `number` | Sim | Total de livros no catálogo |

### Features

- **Título** — "Acervo **Docente**" (Playfair, itálico)
- **Subtítulo** — Texto descritivo
- **Status bar** — Ponto verde + "Base de Dados Ativa · N títulos"

### Exemplo

```tsx
import { SiteHeader } from '@/components/site-header'

<SiteHeader total={482} />
```

---

## useDebounced Hook

Hook custom para debounce de valores.

### Props

```typescript
function useDebounced<T>(value: T, delay: number): T
```

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `value` | `T` | Valor a ser debounced |
| `delay` | `number` (ms) | Tempo de debounce |

### Exemplo

```tsx
import { useDebounced } from '@/lib/hooks/useDebounced'

function SearchInput() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounced(query, 300)

  // Só busca quando debouncedQuery mudar
  useEffect(() => {
    // fetch...
  }, [debouncedQuery])
}
```

---

## Tipos Relacionados

- [Book](../types.md#book)
- [ApiResponse](../types.md#apiresponse)
- [BookCatalogProps](../types.md#bookcatalogprops)