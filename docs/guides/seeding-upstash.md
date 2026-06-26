# Popular Índice Upstash Search

> **Pré-requisitos:** Credenciais Upstash, `.env.local` configurado
> **Tempo estimado:** 5-15 minutos (dependendo do número de livros)
> **Nível:** Intermediário

Este guia mostra como popular o índice Upstash Search com os livros do catálogo.

## 1. Configurar Credenciais

Edite `.env.local`:

```bash
UPSTASH_SEARCH_REST_URL="https://seu-indice-region.search.upstash.io"
UPSTASH_SEARCH_REST_TOKEN="seu-token-admin"
```

> **Nota:** O token **deve ser o admin**, não o readonly.

## 2. Verificar Conexão

```bash
node -e "
const { Search } = require('@upstash/search');
const s = new Search({ url: process.env.UPSTASH_SEARCH_REST_URL, token: process.env.UPSTASH_SEARCH_REST_TOKEN });
s.index('seu-indice').info().then(console.log).catch(console.error);
"
```

## 3. Executar Seeding

```bash
pnpm seed:search
```

### Output Esperado

```
📖 Lendo books.json...
📚 482 livros encontrados
🚀 Iniciando upsert em batches...
✅ Batch 1: 100/482
✅ Batch 2: 200/482
✅ Batch 3: 300/482
✅ Batch 4: 400/482
✅ Batch 5: 482/482

🎉 Concluído! Sucesso: 482, Erros: 0

🔍 Teste de busca: ['Título do Livro Encontrado']
```

## 4. Verificar Busca

Teste no navegador:

```
http://localhost:3000/api/books?q=palavra-chave
```

Resposta esperada:

```json
{
  "items": [...],
  "total": 150,
  "page": 1,
  "hasMore": true
}
```

## Problemas Comuns

| Problema | Causa | Solução |
|----------|-------|---------|
| `UPSTASH_SEARCH_REST_TOKEN is missing` | `.env.local` não carregado | Reinicie o terminal |
| `Connection refused` | URL incorreta | Verifique `UPSTASH_SEARCH_REST_URL` |
| `401 Unauthorized` | Token inválido | Gere novo token no console Upstash |
| `Rate limit exceeded` | Muitos requests rápido | Aguarde ou reduza batch size |
| `Batch failed` | Dados inválidos | Verifique JSON no arquivo |

## Configurações Avançadas

### Batch Size

No script `scripts/seed-upstash-search.ts`:

```typescript
const BATCH_SIZE = 100  // Pode reduzir para 50 se rate limit
```

### Delay entre Batches

```typescript
await new Promise((r) => setTimeout(r, 150)) // 150ms entre batches
```

## Reindexar (Apagar e Recriar)

Para recriar do zero:

```bash
# Resetar índice
node -e "
const { Search } = require('@upstash/search');
const s = new Search({ url: process.env.UPSTASH_SEARCH_REST_URL, token: process.env.UPSTASH_SEARCH_REST_TOKEN });
s.index('seu-indice').reset().then(() => console.log('✅ Resetado'));
"

# Reexecutar seed
pnpm seed:search
```

## Verificar Estatísticas

```bash
node -e "
import('scripts/seed-upstash-search.ts').then(() => {
  // ou use o método getIndexStats()
})
"
```

## Próximos Passos

- [Adicionar Livros](adding-books.md) — Popule mais livros
- [API Reference](../reference/api/books.md) — Teste a busca