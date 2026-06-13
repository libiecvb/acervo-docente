# Análise de Arquitetura — Acervo Docente

> **Projeto:** Acervo Docente — Catálogo de livros com recomendações pedagógicas e planos de aula  
> **Framework:** Next.js 16 (App Router) + React 19  
> **Data da análise:** 2026-06-12

---

## 📁 Estrutura do Projeto

```
acervo-docente/
├── app/
│   ├── api/books/route.ts      # API endpoint para busca paginada
│   ├── globals.css             # Estilos globais (Tailwind v4 + CSS variables)
│   ├── layout.tsx              # Layout raiz (fontes, metadata, analytics)
│   └── page.tsx                # Página principal
├── components/
│   ├── ui/                     # Componentes UI (shadcn/ui style)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── skeleton.tsx
│   ├── book-card.tsx           # Card individual de livro (expansível)
│   ├── book-catalog.tsx        # Catálogo com busca, paginação, skeletons
│   └── site-header.tsx         # Cabeçalho com título e contador
├── data/
│   └── books.json              # Base de dados (~1.1MB, centenas de livros)
├── lib/
│   ├── books.ts                # Tipos, busca, utilitários de livros
│   └── utils.ts                # Utilitários gerais (cn, etc.)
└── config files (tsconfig, next.config, etc.)
```

---

## 🔧 Tecnologias Principais

| Categoria | Tecnologias |
|-----------|-------------|
| **Framework** | Next.js 16.2.6 (App Router, RSC) |
| **React** | 19 (com Client Components onde necessário) |
| **Styling** | Tailwind CSS v4 + `tw-animate-css` + `shadcn/ui` (style: `base-nova`) |
| **UI Primitives** | `@base-ui/react` (headless components) |
| **Icons** | `lucide-react` |
| **Data Fetching** | `swr` (client-side) + `fetch` nativo (server) |
| **Fonts** | Geist Sans/Mono + Playfair Display (via `next/font`) |
| **Analytics** | `@vercel/analytics` (apenas em produção) |

---

## ⚙️ Funcionamento Detalhado

### 1. **Dados (`data/books.json` + `lib/books.ts`)**

- **~1.1MB** de livros em JSON, cada um com:

```typescript
interface Book {
  id: string           // "1", "2", ...
  titulo: string       // Título do livro
  autor: string        // Autor
  resumo: string       // Resumo/descrição
  principais_topicos: string  // Tópicos separados por vírgula
  link: string         // Google Drive link
}
```

- `searchBooks(query)` — busca full-text em título, autor, tópicos e resumo (AND entre termos)
- `getTopics(book)` — parseia `principais_topicos` em array de badges

### 2. **API (`app/api/books/route.ts`)**

- **GET** `/api/books?q=termo&page=1`
- Paginação fixa: **24 itens/página**
- Retorna: `{ items: Book[], total: number, page: number, hasMore: boolean }`
- `dynamic = "force-dynamic"` — sem cache estático

### 3. **Catálogo (`components/book-catalog.tsx`)**

- **Client Component** (`"use client"`)
- **Busca com debounce** (300ms) via hook custom `useDebounced`
- **SWR** para fetching com `keepPreviousData` (UX suave ao paginar)
- **Acumulação de resultados** — ao clicar "Carregar mais", adiciona aos já exibidos (infinite scroll via botão)
- **Estados:**
  - *Skeleton* (6 placeholders) no primeiro load
  - *Empty state* se nenhum resultado
  - *Grid 2 colunas* (md+) com `BookCard`

### 4. **BookCard (`components/book-card.tsx`)**

- **Expansível** — mostra/oculta resumo completo + tópicos (badges)
- **Copiar info** — copia `título — autor\n\nresumo` para clipboard (feedback visual com ✓)
- **Link externo** — abre `book.link` em nova aba (Google Drive)
- **Metadados** — exibe `ID: #N`

### 5. **Header (`components/site-header.tsx`)**

- Título "Acervo **Docente**" (Playfair Display, itálico no "Docente")
- Subtítulo descritivo
- Barra de status: "Base de Dados Ativa · **N títulos**" (contador formatado pt-BR)

### 6. **Tema & Estilos (`app/globals.css`)**

- **CSS Variables** (OKLCH) para light/dark mode automático
- Variáveis semânticas: `--primary`, `--card`, `--muted`, `--border`, etc.
- `--radius` base = `0.625rem` (10px) com escalas
- Fontes via `--font-*` variables (carregadas no layout)

---

## 🚀 Como Rodar

```bash
# Instalar dependências
pnpm install

# Desenvolvimento
pnpm dev        # http://localhost:3000

# Build de produção
pnpm build
pnpm start
```

---

## 💡 Pontos de Atenção / Melhorias Possíveis

| Área | Observação |
|------|------------|
| **Performance** | `books.json` de 1.1MB é importado no bundle — considerar mover para DB (SQLite/Postgres) ou arquivo estático servido via CDN |
| **Busca** | Atual é client-side no servidor (filtra array em memória) — OK para ~1k livros, mas não escala |
| **Tipagem** | `books.json` não tem validação de schema (Zod/Arktype) |
| **A11y** | Bom uso de `aria-label`, semântica HTML, mas faltam landmarks (`<main>`, `<section>`) em alguns pontos |
| **SEO** | Metadata básica presente; poderia adicionar `openGraph`, `twitter`, sitemap |
| **Testes** | Não há testes (unitários, e2e, visual regression) |

---

## 📋 Resumo do Fluxo de Dados

```
User digita busca
       ↓
debounce(300ms) → SWR fetch /api/books?q=...&page=1
       ↓
API: searchBooks(query) → filtra books[] → pagina (24) → JSON
       ↓
BookCatalog acumula items → renderiza grid de BookCards
       ↓
User clica "Carregar mais" → page++ → SWR fetch página seguinte → append
```

---

## ✅ Conclusão

É um projeto **bem estruturado**, moderno (React 19, Next 16, Tailwind v4), com boa separação de responsabilidades e UX polida (skeletons, debounce, paginação infinita, dark mode automático). A arquitetura segue as melhores práticas atuais do ecossistema Next.js com App Router e Server Components.