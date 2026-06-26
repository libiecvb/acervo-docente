# Desenvolvimento

> **Pré-requisitos:** Instalação concluída
> **Tempo estimado:** 15 minutos
> **Nível:** Iniciante

Este guia explica a estrutura do projeto, scripts disponíveis e fluxo de desenvolvimento.

## Estrutura de Pastas

```
acervo-docente/
├── app/                    # App Router (Next.js 16)
│   ├── api/books/route.ts  # API endpoint GET /api/books
│   ├── globals.css         # CSS global (Tailwind v4 + vars)
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   └── page.tsx            # Página principal
├── components/             # Componentes React
│   ├── ui/                 # Primitivas UI (Button, Badge, etc.)
│   ├── book-card.tsx       # Card individual de livro
│   ├── book-catalog.tsx    # Catálogo com busca + paginação
│   └── site-header.tsx     # Header com título + contador
├── data/                   # Dados estáticos
│   └── books.json          # Base de livros (~1.1MB)
├── lib/                    # Lógica de negócio
│   ├── books.ts            # Tipos, busca local, helpers
│   ├── search.ts           # Cliente Upstash Search
│   └── utils.ts            # Utilitários (cn)
├── scripts/                # Scripts operacionais
│   └── seed-upstash-search.ts
├── docs/                   # Documentação
└── config files            # tsconfig, next.config, etc.
```

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia servidor de desenvolvimento (Turbopack) |
| `pnpm build` | Build de produção |
| `pnpm start` | Inicia servidor de produção |
| `pnpm lint` | Executa ESLint |
| `pnpm seed:search` | Popula índice Upstash Search |

## Fluxo de Desenvolvimento

### 1. Criar Branch

```bash
git checkout -b feat/nome-da-feature
```

### 2. Desenvolver

- Use Server Components por padrão
- Adicione `"use client"` apenas quando necessário
- Siga padrões de acessibilidade
- Documente exports públicos com JSDoc/TSDoc

### 3. Testar Localmente

```bash
pnpm lint
pnpm build
```

### 4. Commitar

```bash
git commit -m "feat(search): adiciona filtro por autor"
```

### 5. Push e PR

```bash
git push origin feat/nome-da-feature
```

## Debugging

### VS Code

Extensões recomendadas:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript + JavaScript Language Features (built-in)

### Logs

- API errors: `console.error('[API /books] Erro:', error)`
- Search fallback: `console.warn('[Search] Upstash indisponível, usando fallback local:', error)`
- Upstash errors: `console.error('[Upstash Search] Erro na busca:', error)`

## Hot Reload

O Next.js 16 com Turbopack oferece hot reload instantâneo. Se não funcionar:

```bash
# Pare o servidor (Ctrl+C)
pnpm dev
```

## Próximos Passos

- [Deploy](deployment.md) — Publique na Vercel
- [Adicionar Livros](../guides/adding-books.md) — Popule o catálogo
- [API Reference](../reference/api/books.md) — Entenda os endpoints