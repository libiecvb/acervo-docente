# Troubleshooting

Problemas comuns e soluções para o Acervo Docente.

## Erros de Build

### "Module not found: @/"

```
error: Cannot find module '@/components/...'
```

**Causa:** `tsconfig.json` não carregado ou incorreta.

**Solução:**
```bash
# Reinicie o dev server
pnpm dev

# Verifique paths
cat tsconfig.json | grep "@/*"
```

### "Property does not exist on type '{}'"

```
Property 'UPSTASH_SEARCH_REST_URL' does not exist on type '{}'.
```

**Causa:** Variáveis de ambiente não declaradas.

**Solução:**
```bash
# Adicione ao .env.local
cp .env.example .env.local

# Types declarados em next-env.d.ts ou .env.d.ts
```

---

## Erros de Runtime

### Busca retorna "Nenhum livro encontrado"

| Possibilidade | Solução |
|---------------|---------|
| Query vazia | Digite algo na busca |
| Upstash sem dados | Rode `pnpm seed:search` |
| Credenciais erradas | Verifique `.env.local` |
| Termos muito específicos | Tente termos mais genéricos |

### Ícone de loading infinito

```tsx
// No BookCatalog, isLoading fica true
```

**Causa:** API não responde ou retorna erro.

**Solução:**
1. Abra DevTools → Network
2. Verifique `/api/books` response
3. Cheque console para erros
4. Valide `.env.local`

### "Copy failed" ao copiar livro

```
"Não foi possível copiar"
```

**Causa:** Browser bloqueia clipboard sem HTTPS/interaction.

**Solução:**
- Só funciona em `https://` ou `localhost`
- Clique no botão (é requerido interaction)

---

## Erros de Upstash Search

### "Upstash Search credentials not configured"

```typescript
throw new Error('Upstash Search credentials not configured')
```

**Causa:** Variáveis de ambiente faltando.

**Solução:**
```bash
# Verifique
echo $UPSTASH_SEARCH_REST_URL
echo $UPSTASH_SEARCH_REST_TOKEN

# Configure
pnpm seed:search
```

### "Rate limit exceeded"

**Causa:** Muitos requests ao Upstash em pouco tempo.

**Solução:**
- Reduza `BATCH_SIZE` no script de seed
- Aumente delay: `setTimeout(r, 200)` → `300`
- Aguarde 1 minuto (reset do rate limit)

### "401 Unauthorized"

**Causa:** Token inválido ou expirado.

**Solução:**
1. Acesse https://console.upstash.com
2. Gere novo token
3. Atualize `.env.local`
4. Reinicie dev server

---

## Problemas de UI

### Dark mode não funciona

**Causa:** Sistema operacional sem `prefers-color-scheme`.

**Solução:**
- Force via DevTools CSS:
```css
html { class="dark" }
```

### Fontes não carregam

```
Font fallback applied
```

**Causa:** Network lento ou CSP bloqueia fonts.

**Solução:**
- Aguarde carregamento
- Verifique DevTools → Network → Fonts
- Cheque CSP no Vercel dashboard

### Layout quebrado em mobile

**Causa:** Classes responsivas erradas.

**Solução:**
- Verifique `md:grid-cols-2` no grid
- Teste `max-w-5xl mx-auto` containers
- Use DevTools → Toggle device toolbar

---

## Performance

### Build lento (> 30s)

**Causa:** Turbopack cold start ou muitas páginas.

**Solução:**
```bash
# Limpe cache
rm -rf .next
pnpm build

# Use build cache do Turbopack
```

### Busca lenta (> 500ms)

**Causa:** Upstash lento ou fallback sem otimização.

**Solução:**
- Verifique network latency
- Considere cache via headers
- Monitore via Vercel Analytics

---

## Deploy Vercel

### "Build failed" no Vercel

**Causa comum:** Variáveis de ambiente não configuradas.

**Solução:**
1. Vercel Dashboard → Settings → Environment Variables
2. Adicione `UPSTASH_SEARCH_REST_URL`
3. Adicione `UPSTASH_SEARCH_REST_TOKEN`
4. Redeploy

### "Function exceeded memory limit"

**Causa:** JSON grande + processamento server-side.

**Solução:**
- Optimize `data/books.json`
- Use streaming response
- Considere pagination server-side mais agressiva

---

## Testes (quando implementado)

### "Tests timeout"

**Causa:** Testes assíncronos sem `await`.

**Solução:**
```typescript
// ❌ Errado
expect(fetch)

// ✅ Certo
await waitFor(() => expect(fetch).toHaveBeenCalled())
```

### "Cannot find module '@/'"

**Causa:** Alias não configurado no Vitest.

**Solução:**
```typescript
// vitest.config.ts
export default {
  test: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
}
```

## Acessibilidade (A11y)

### Contraste insuficiente

**Ferramenta:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**Cores WCAG AA mínimas:**
- Texto grande (18pt+): 3:1
- Texto normal: 4.5:1

### Missing landmarks

```
Page should contain a main landmark
```

**Solução:**
```tsx
// app/page.tsx
<main className="min-h-screen">
  <SiteHeader />
  <BookCatalog />
</main>
```

---

## Contato

Problemas não resolvidos?

- [GitHub Issues](https://github.com/seu-usuario/acervo-docente/issues)
- E-mail: bibliotecaiecvb@gmail.com