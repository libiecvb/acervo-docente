# ADR 004: SWR vs TanStack Query

**Status:** Aceito
**Data:** 2026-06-12
**Autor:** Claude Code
**Decidores:** Equipe de desenvolvimento

## Contexto

Precisávamos de uma solução para:

- Fetch de dados da API
- Cache inteligente
- Revalidação automática
- Paginação infinita
- Bundle size pequeno

Alternativas:

1. **SWR** (Vercel)
2. **TanStack Query** (React Query)
3. **Fetch API nativo** (React 19)
4. **React Query + Suspense**

## Decisão

Escolhemos **SWR** para data fetching.

**Justificativa:**

- Desenvolvido pela Vercel (integrado com Next.js)
- Bundle size menor (~10KB vs ~30KB TanStack)
- API simples para casos básicos
- `keepPreviousData` para smooth pagination
- `mutate` para updates otimísticos

## Consequências

### Positivas

- Integrado com App Router (fetch cache)
- Menor overhead de configuração
- Pagination + accumulation simples
- Suspense mode disponível

### Negativas

- Menos features que TanStack Query
- Sem DevTools oficial
- Menos comunidade que TanStack
- Sem query invalidation complexa

### Riscos

- Se precisar de mutations complexas, migrar para TanStack
- Se precisar de DevTools, usar TanStack

## Implementação

```tsx
// components/book-catalog.tsx
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const { data, isLoading } = useSWR<ApiResponse>(
  `/api/books?q=${debounced}&page=${page}`,
  fetcher,
  { keepPreviousData: true }
)

// Accumulation pattern
useEffect(() => {
  if (!data) return
  setAccumulated(prev =>
    data.page === 1 ? data.items : [...prev, ...data.items]
  )
}, [data])
```

## Alternativas Consideradas

| Alternativa | Prós | Contras | Decisão |
|-------------|------|---------|---------|
| SWR | Bundle menor, Vercel, simples | Menos features | ✅ Escolhido |
| TanStack | DevTools, mutations, cache | Bundle larger | Rejeitado |
| Native fetch | Zero deps | Sem cache, boilerplate | Rejeitado |
| React 19 Server Actions | Server-only, forms | Client fetch needed | Rejeitado |

## Quando Migrar para TanStack

- Mutations complexas (POST/PUT/DELETE)
- Query invalidation cross-component
- DevTools para debugging
- Polling avançado

## Referências

- [SWR Docs](https://swr.vercel.app)
- [TanStack Query](https://tanstack.com/query)
- [Next.js App Router Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)