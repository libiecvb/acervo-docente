# Arquitetura do Acervo Docente

> **Visão macro do sistema, decisões técnicas e fluxos de dados.**

---

## Estrutura do Projeto

```
acervo-docente/
├── app/
│   ├── api/
│   │   └── books/route.ts    # API GET /api/books (paginação)
│   ├── layout.tsx            # Root layout (fonts, metadata, analytics)
│   ├── page.tsx              # Página principal
│   └── globals.css           # CSS vars (OKLCH), Tailwind v4, dark mode
├── components/
│   ├── ui/                   # Primitivas (Button, Badge, Skeleton, Dialog)
│   ├── book-card.tsx         # Card expansível + copy + link
│   ├── book-catalog.tsx      # Catálogo + busca + paginação infinita
│   └── site-header.tsx       # Header + contador
├── data/
│   └── books.json            # ~1.1MB de livros (JSON plano)
├── lib/
│   ├── books.ts              # Tipos, busca local, helpers
│   ├── search.ts             # Cliente Upstash + hybrid search
│   └── utils.ts              # cn utility
├── scripts/
│   └── seed-upstash-search.ts  # Seed do índice
└── docs/                     # Documentação (Nextra)
```

---

## Tecnologias

| Categoria | Tecnologia | Versão |
|-----------|------------|--------|
| Framework | Next.js | 16.2.6 |
| React | React | 19 |
| Styling | Tailwind CSS | 4.2.0 |
| UI Primitives | @base-ui/react | 1.5.0 |
| Icons | lucide-react | 1.16.0 |
| Data Fetching | SWR | 2.4.1 |
| Search | Upstash Search | latest |
| Analytics | @vercel/analytics | 1.6.1 |
| Fonts | next/font/google | built-in |

---

## Fluxo de Dados

```mermaid
flowchart LR
    A[User digita na busca] --> B{Há query?}
    B -->|Sim| C[Debounce 300ms]
    B -->|Não| D[Mostra todos]
    C --> E[SWR fetch /api/books]
    E --> F[API route: searchBooks]
    F --> G{Upstash disponível?}
    G -->|Sim| H[Upstash hybrid search]
    G -->|Não| I[Local search (AND)]
    H --> J[Paginação server-side]
    I --> J
    J --> K[Retorna JSON]
    K --> L[BookCatalog acumula]
    L --> M[Renderiza grid]
    M --> N[BookCard individual]

    style A fill:#e1f5fe
    style N fill:#f3e5f5
```

### Descrição Detalhada

1. **User digita** → `input` em `BookCatalog`
2. **Debounce** → Hook `useDebounced` (300ms)
3. **SWR fetch** → `/api/books?q=...&page=1`
4. **API route** → `searchBooks()` em `lib/books.ts`
5. **Hybrid search** → Tentativa Upstash → fallback local
6. **Paginação** → 24 itens por página
7. **Accumulação** → Estado `accumulated` em `BookCatalog`
8. **Renderização** → Grid 2 colunas → `BookCard`

---

## Decisões Arquiteturais

| ADR | Decisão | Status |
|-----|---------|--------|
| [001](./adrs/001-upstash-search.md) | Upstash Search + fallback local | ✅ Aceito |
| [002](./adrs/002-json-data.md) | JSON estático vs database | ✅ Aceito |
| [003](./adrs/003-ui-library.md) | @base-ui/react vs Radix UI | ✅ Aceito |
| [004](./adrs/004-data-fetching.md) | SWR vs TanStack Query | ✅ Aceito |

---

## Performance

### Bundle Size

- JSON ~1.1MB carregado via `import` (não ideal para escala)
- Turbopack (Next 16) para build rápido
- Tree-shaking automático

### Search Performance

- Upstash Search: sub-100ms
- Local fallback: sub-50ms (filtra array em memoria)
- Debounce: 300ms para evitar spam

### Dark Mode

- CSS variables (OKLCH) — sem JS
- `prefers-color-scheme` media query
- Zero runtime overhead

---

## Segurança

- Nenhuma autenticação (dados públicos)
- API read-only (sem escrita)
- Links externos com `rel="noopener noreferrer"`
- Analytics apenas em produção

---

## Limitations

| Limitação | Impacto | Solução futura |
|-----------|---------|----------------|
| JSON no bundle (~1.1MB) | Bundle size + memory | Database (SQLite/PlanetScale) |
| Search client-side | Não escala | Upstash apenas |
| Sem testes | Bugs em produção | Vitest + Playwright |
| Sem schema validation | Dados corrompidos | Zod/Arktype |

---

## Próximos Passos

- [ ] Migrar para PlanetScale/MySQL
- [ ] Implementar testes (Vitest + Playwright)
- [ ] Schema validation (Zod)
- [ ] Storybook para componentes
- [ ] Nextra para docs site