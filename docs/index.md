# Documentação — Acervo Docente

Bem-vindo à documentação do **Acervo Docente**, um catálogo de livros para apoio pedagógico construído com Next.js 16, React 19, Tailwind CSS v4 e Upstash Search.

## 🗺️ Mapa da Documentação

Esta documentação segue a estrutura **Diátaxis**:

| Tipo | Para quem | O que você encontra |
|------|-----------|---------------------|
| **Tutorial** | Iniciantes | Passo a passo para começar do zero |
| **How-to Guides** | Usuários ativos | Receitas para tarefas específicas |
| **Reference** | Desenvolvedores | Documentação técnica de API, componentes e tipos |
| **Explanation** | Arquitetos/mantenedores | Contexto, decisões e arquitetura do sistema |

## 🚀 Comece Aqui

### Para novos usuários

1. [Instalação](getting-started/installation.md) — Configure o projeto localmente
2. [Desenvolvimento](getting-started/development.md) — Entenda a estrutura e scripts
3. [Deploy](getting-started/deployment.md) — Publique na Vercel

### Para mantenedores

1. [Arquitetura](architecture/overview.md) — Visão macro do sistema
2. [ADRs](architecture/adrs/) — Decisões arquiteturais registradas
3. [Guia de Contribuição](../../CONTRIBUTING.md) — Padrões de código e PRs

### Para usuários avançados

1. [API Reference](reference/api/books.md) — Documentação da API `/api/books`
2. [Componentes](reference/components/) — Props, states e exemplos dos componentes
3. [Tipos TypeScript](reference/types.md) — Interfaces e contratos de dados

## 📖 Guias Práticos

| Guia | Descrição |
|------|-----------|
| [Adicionar Livros](guides/adding-books.md) | Como adicionar novos livros ao catálogo |
| [Popular Upstash](guides/seeding-upstash.md) | Como rodar o script de seeding |
| [Customizar Tema](guides/customizing-theme.md) | Como alterar cores, fontes e dark mode |

## 🔧 Referência Técnica

| Documento | Descrição |
|-----------|-----------|
| [API: `/api/books`](reference/api/books.md) | Parâmetros, responses, exemplos |
| [Tipos TypeScript](reference/types.md) | `Book`, `SearchResult`, `ApiResponse` |
| [Configuração](reference/config.md) | `next.config`, `tsconfig`, Tailwind, Vercel |
| [Componentes UI](reference/components/) | Button, Badge, Skeleton, Dialog |
| [Componentes App](reference/components/) | BookCard, BookCatalog, SiteHeader |

## 🏗️ Arquitetura

| Documento | Descrição |
|-----------|-----------|
| [Overview](architecture/overview.md) | Visão macro + diagramas Mermaid |
| [Fluxo de Dados](architecture/data-flow.md) | Busca → API → SWR → UI |
| [ADR 001](architecture/adrs/001-upstash-search.md) | Upstash Search + fallback local |
| [ADR 002](architecture/adrs/002-json-data.md) | JSON estático vs database |
| [ADR 003](architecture/adrs/003-ui-library.md) | @base-ui/react vs Radix UI |
| [ADR 004](architecture/adrs/004-data-fetching.md) | SWR vs TanStack Query |

## 🤝 Contribuição

- [Guia de Contribuição](../../CONTRIBUTING.md) — Padrões, commits, PRs
- [Política de Segurança](../../SECURITY.md) — Reportar vulnerabilidades
- [Changelog](../../CHANGELOG.md) — Histórico de versões

## 📌 Atalhos Rápidos

```bash
# Desenvolvimento local
pnpm install
cp .env.example .env.local
pnpm dev

# Popular índice de busca
pnpm seed:search

# Build de produção
pnpm build

# Lint
pnpm lint
```

## 📞 Suporte

- **Issues:** https://github.com/seu-usuario/acervo-docente/issues
- **E-mail:** bibliotecaiecvb@gmail.com
- **Deploy:** https://vercel.com

---

**Última atualização:** 2026-06-21