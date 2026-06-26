# API Reference: Books

`GET /api/books`

## Descrição

Busca livros no catálogo com paginação server-side. Utiliza busca híbrida (Upstash Search + fallback local).

## Autenticação

- [x] **Pública** — Não requer autenticação

## Parâmetros

### Query Parameters

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| `q` | `string` | Não | `''` | Query de busca (busca em título, autor, tópicos e resumo) |
| `page` | `number` | Não | `1` | Número da página (1-indexed) |

## Responses

### Sucesso: `200 OK`

```json
{
  "items": [
    {
      "id": "1",
      "titulo": "Título do Livro",
      "autor": "Nome do Autor",
      "resumo": "Descrição completa...",
      "principais_topicos": "Tópico 1, Tópico 2",
      "link": "https://drive.google.com/file/d/..."
    }
  ],
  "total": 150,
  "page": 1,
  "hasMore": true
}
```

### Erro: `500 Internal Server Error`

```json
{
  "error": "Erro ao buscar livros",
  "items": [],
  "total": 0,
  "page": 1,
  "hasMore": false
}
```

## Exemplos

### Busca Simples

```bash
curl "http://localhost:3000/api/books?q=Sabedoria"
```

### Busca com Paginação

```bash
curl "http://localhost:3000/api/books?q=Teologia&page=2"
```

### Todos os Livros

```bash
curl "http://localhost:3000/api/books"
```

## Comportamento

### Busca Híbrida

1. Tenta buscar no Upstash Search primeiro
2. Se falhar (network/credentials), usa busca local em memória
3. Logs de warning são exibidos quando fallback é usado

### Lógica de Busca Local

- **AND logic** — Todos os termos devem aparecer no texto
- **Case-insensitive** — Não diferencia maiúsculas/minúsculas
- **Campos buscados:** `titulo`, `autor`, `principais_topicos`, `resumo`

### Paginação

- **Tamanho fixo:** 24 itens por página
- **Acumulativa:** No client, resultados são acumulados ao clicar "Carregar mais"

## Código Fonte

```typescript
// app/api/books/route.ts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') ?? ''
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)

  const results = await searchBooks(query)
  const total = results.length
  const start = (page - 1) * PAGE_SIZE
  const items = results.slice(start, start + PAGE_SIZE)
  const hasMore = start + PAGE_SIZE < total

  return NextResponse.json({ items, total, page, hasMore })
}
```

## Referências

- [Book Type](../types.md#book)
- [searchBooks](../types.md#searchbooks)
- [Client-side Usage](https://github.com/seu-usuario/acervo-docente/blob/main/components/book-catalog.tsx) — BookCatalog usa SWR