# Session Log - Acervo Docente

**Data:** 2026-06-13  
**Projeto:** Acervo Docente (Next.js 16 + Upstash Search)

---

## 1. Configuração Inicial do Upstash

### Credenciais Configuradas
- **Email:** `bibliotecaiecvb@gmail.com`
- **API Key:** `c3b8169e-b26e-4c75-95e1-bd036e704179`

### Arquivos Criados
| Arquivo | Propósito | Proteção |
|---------|-----------|----------|
| `.upstash.json` | Config CLI Upstash | `.gitignore` |
| `.env.local` | Variáveis de ambiente (Upstash + Vercel) | `.gitignore` (padrão `.env*.local`) |

### Integração Vercel → Upstash Search
Descoberto índice existente via `vercel integration list`:
- **Nome:** `upstash-search-cerulean-tree`
- **URL:** `https://loving-possum-40689-gcp-usc1-search.upstash.io`
- **Tokens:** `UPSTASH_SEARCH_REST_TOKEN` (admin) + `UPSTASH_SEARCH_REST_READONLY_TOKEN`
- **Nome do índice:** `loving-possum-40689` (extraído da URL)

---

## 2. Arquitetura de Busca Implementada

### Stack
- **SDK:** `@upstash/search` v0.1.7
- **Runtime:** Next.js 16 (Turbopack) + React 19
- **Busca:** Híbrida (BM25 full-text + embeddings semânticos)

### Estrutura de Arquivos
```
lib/
├── books.ts          # Interface Book + fallback local + searchBooks() híbrida
├── search.ts         # Cliente Upstash Search (lazy init) + searchBooks(), filtros
├── random-books.ts   # Utilitários para seleção aleatória diversa (não usado)
scripts/
├── seed-upstash-search.ts  # Seed em batches de 100
components/
├── book-catalog.tsx  # Catálogo com busca, paginação, debounce
├── home-highlights.tsx   # "Destaques da Semana" (criado, depois removido)
app/
├── page.tsx          # Homepage (query inicial "Sabedoria")
├── api/
│   ├── books/route.ts      # GET /api/books?q=&page=
│   └── random-books/route.ts  # GET /api/random-books?count=&seed=
```

### Fluxo de Busca
```
Usuário digita → BookCatalog (debounce 300ms) 
  → /api/books?q=... 
  → lib/books.searchBooks() 
  → lib/search.searchBooks() [Upstash Search] 
  → Fallback local se erro
```

### Configuração de Busca (lib/search.ts)
```typescript
semanticWeight: 0.75    // 75% semântico / 25% full-text
reranking: false        // Desativado
inputEnrichment: true   // Padrão (expande query)
topK: 50 (default)      // Limite de resultados
```

---

## 3. Seed do Índice Upstash Search

### Dados Originais
- **Fonte:** `data/books.json` (1.078 livros, ~1.1MB)
- **Campos:** id, titulo, autor, resumo, principais_topicos, link

### Indexação (scripts/seed-upstash-search.ts)
```typescript
// Cada documento:
{
  id: book.id,
  content: { text: `${titulo} ${autor} ${resumo} ${topicos}` },  // Blob único
  metadata: { titulo, autor, resumo, principais_topicos, link, 
              topics_array: [...], autor_normalized: "..." }
}
```
- **Batch size:** 100 (limite da API)
- **Delay entre batches:** 150ms
- **Total indexado:** 1.078 documentos ✅

### ⚠️ Problema Identificado: Relevância Baixa
**Causa raiz:** Todos os campos concatenados em `content.text` (blob único)
- Título, autor, resumo, tópicos têm **peso igual**
- `semanticWeight: 0.75` → busca semântica domina (sinônimos, conceitos relacionados)
- `inputEnrichment: true` expande "Sabedoria" → "Prudência", "Conhecimento", etc.
- Sem field boosting (título não vale mais que resumo)

---

## 4. Features Implementadas (e Revertidas)

### ✅ Mantidas
1. **Busca híbrida Upstash** com fallback local
2. **Homepage com query inicial "Sabedoria"** (`initialQuery="Sabedoria"`)
3. **Lazy initialization** do cliente Upstash (evita erro build-time)
4. **TypeScript build OK** (`npm run build` passa)

### 🔄 Criadas e Removidas
| Feature | Status | Arquivos |
|---------|--------|----------|
| "Destaques da Semana" (10 livros aleatórios) | ❌ Removida | `home-highlights.tsx`, `random-books.ts`, `api/random-books` |
| Persistência seed no localStorage | ❌ Removida | Parte do `home-highlights.tsx` |

> Arquivos mantidos no disco mas não importados: `lib/random-books.ts`, `components/home-highlights.tsx`, `app/api/random-books/route.ts`

---

## 5. Próximos Passos Técnicos (Priorizados)

### 🔴 CRÍTICO - Corrigir Relevância da Busca
**Opção A - Ajustes Rápidos (recomendado agora):**
```typescript
// lib/search.ts - searchBooks()
const results = await searchIndex.search({
  query: q,
  limit: options?.topK ?? 50,
  filter: options?.filter,
  semanticWeight: 0.3,           // ↓ Era 0.75
  reranking: true,               // ↑ Era false
  inputEnrichment: false,        // ↑ Era true (padrão)
})
```

**Opção B - Reindexar com Campos Separados (melhor longo prazo):**
```typescript
// Novo formato upsert
content: {
  titulo: book.titulo,
  autor: book.autor,
  resumo: book.resumo,
  principais_topicos: book.principais_topicos,
}
// Permite field boosting futuro via API REST
```

### 🟡 IMPORTANTE - Melhorias de UX
1. **Autocomplete / Sugestões** - endpoint `/api/books/suggest?q=`
2. **Facetas / Filtros laterais** - por tópico, autor
3. **Highlighting** - marcar termo buscado nos resultados
4. **Busca "exata" no título** - priorizar matches em `titulo`

### 🟢 OPCIONAL - Features Avançadas
- Seed incremental (add/update/delete individual)
- Monitoramento: queries sem resultado, latência
- Cache Redis para queries frequentes
- Reindexação agendada (Vercel Cron)

---

## 6. Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Seed Upstash Search
npm run seed:search

# Testar busca via API
curl "http://localhost:3000/api/books?q=Sabedoria"

# Ver logs Vercel
vercel logs libiecvb

# Listar integrações Vercel
vercel integration list libiecvb
```

---

## 7. Decisões de Arquitetura Registradas

| Decisão | Justificativa |
|---------|---------------|
| Lazy init Upstash client | Evita erro `UPSTASH_SEARCH_REST_TOKEN is missing!` no build |
| Fallback local em `lib/books.ts` | Resiliência se Upstash cair |
| `semanticWeight: 0.75` inicial | Explorar busca semântica (depois ajustado para 0.3) |
| Batch 100 no seed | Limite da API Upstash Search |
| `dedupingInterval: 1h` no SWR | Estabilidade de seleção aleatória |
| `initialQuery` no BookCatalog | Flexibilidade para homepage temática |

---

## 8. Estado Atual do Projeto

- ✅ Build passa
- ✅ Busca funcional (Upstash + fallback)
- ⚠️ Relevância baixa (precisa ajuste `semanticWeight` + `reranking`)
- 📁 Arquivos órfãos do feature "Destaques" podem ser removidos
- 🔧 Próximo: aplicar **Opção A** (ajuste rápido) e testar relevância

---

*Log gerado automaticamente ao final da sessão de desenvolvimento.*