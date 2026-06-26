# ADR 002: JSON Estático vs Database

**Status:** Aceito
**Data:** 2026-06-12
**Autor:** Claude Code
**Decidores:** Equipe de desenvolvimento

## Contexto

O catálogo precisa de armazenamento para ~482 livros (~1.1MB). Opções:

1. **JSON estático** (`data/books.json`)
2. **SQLite** (file-based)
3. **PlanetScale/MySQL** (serverless)
4. **Supabase** (PostgreSQL + Auth)
5. **Upstash Redis** (JSON + Lists)

## Decisão

Decidimos manter **JSON estático** como fonte primária com **Upstash Search** para índice.

**Justificativa:**

- Dados são estáticos (não mudam frequentemente)
- 1.1MB é aceitável para bundle Next.js
- Simplicidade máxima (sem migrations, sem schema)
- Upstash Search já indexa os dados
- Deploy é apenas `git push`

## Consequências

### Positivas

- Zero config de database
- Deploy trivial (sem migrations)
- Busca via Upstash (não precisa SQL LIKE)
- Fácil backup/versionamento via Git

### Negativas

- Não ideal escala (> 5k livros)
- Bundle size aumenta com dados
- Sem ACID (não crítico - dados read-only)

### Riscos

- JSON malformado quebra build
- Não validado (sem Zod no momento)
- Edição manual propensa a erros

## Limites

| Métrica | Valor | Limite considerado |
|---------|-------|-------------------|
| Livros | ~482 | < 1000 aceitável |
| Tamanho JSON | ~1.1MB | < 5MB aceitável |
| Busca | AND lógica | Básica mas funcional |

## Migration Future

Quando ultrapassar limites:

1. **PlanetScale** (MySQL serverless)
2. **Supabase** (PostgreSQL + REST)
3. **Cloudflare D1** (SQLite serverless)

```sql
-- Schema planejado
CREATE TABLE books (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  autor TEXT NOT NULL,
  resumo TEXT,
  principais_topicos TEXT,
  link TEXT NOT NULL
);

CREATE INDEX idx_search ON books(titulo, autor, principais_topicos, resumo);
```

## Referências

- [Next.js Static Data](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-static-data)
- [Upstash Search](https://upstash.com/docs/search)
- [PlanetScale Serverless](https://planetscale.com/docs/concepts/what-is-serverless)