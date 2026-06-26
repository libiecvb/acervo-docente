# ADR 001: Upstash Search + Fallback Local

**Status:** Aceito
**Data:** 2026-06-12
**Autor:** Claude Code
**Decidores:** Equipe de desenvolvimento

## Contexto

O catálogo precisa de busca eficiente em ~1.1MB de dados (~482 livros). Alternativas considered:

1. **Upstash Search** (serverless, full-text + vector)
2. **Fuse.js** (client-side, JS only)
3. **LocalStorage + Fuse.js** (indexedDB)
4. **SQLite** (server-side, file-based)

## Decisão

Decidimos usar **Upstash Search como primário** com **fallback local** em memória.

**Justificativa:**

- Upstash oferece BM25 full-text + vector similarity
- Serverless = zero ops, free tier generoso
- Fallback garante availability se Upstash falhar
- Local search usa lógica AND (todos termos devem aparecer)

## Consequências

### Positivas

- Busca rápida (< 100ms) com Upstash
- Funciona offline/erro com fallback
- Facilidade de deploy (sem database)
- Gratuito no plano básico

### Negativas

- 2 sistemas de busca para manter
- Fallback NÃO é usado em prod normalmente
- Não replica rank do Upstash

### Riscos

- Custos se ultrapassar free tier
- Latência se Upstash lento
- Complexidade extra no código

## Implementação

```typescript
// lib/search.ts
export async function searchBooks(query: string): Promise<Book[]> {
  try {
    const results = await upstashSearchBooks(query, { topK: 100 })
    // map results
  } catch (error) {
    console.warn('[Search] Upstash indisponível, usando fallback local')
    return searchBooksLocal(query)
  }
}
```

## Alternativas Consideradas

| Alternativa | Prós | Contras | Decisão |
|-------------|------|---------|---------|
| Upstash Search | Servidor, rápido, grátis | Network dep, custo futuro | ✅ Escolhido |
| SQLite | Offline, rápido, SQL | Mais complexo, não grátis | Rejeitado (YAGNI) |
| Fuse.js | Funciona offline | Bundle +100KB, menos preciso | Rejeitado |
| Algolia | Boa docs, feature rich | $30+/mes, overkill | Rejeitado |

## Referências

- [Upstash Search Docs](https://upstash.com/docs/search)
- [Hybrid Search Pattern](https://upstash.com/blog/hybrid-search)