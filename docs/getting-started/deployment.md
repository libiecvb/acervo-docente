# Deploy na Vercel

> **Pré-requisitos:** Conta na Vercel, repositório no GitHub/GitLab
> **Tempo estimado:** 20 minutos
> **Nível:** Intermediário

Este guia mostra como publicar o **Acervo Docente** na Vercel.

## 1. Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Repositório no GitHub, GitLab ou Bitbucket
- Credenciais Upstash Search (URL + tokens)

## 2. Conectar Repositório

1. Acesse https://vercel.com/new
2. Importe o repositório `acervo-docente`
3. Configure o projeto:

| Campo | Valor |
|-------|-------|
| Framework Preset | Next.js |
| Root Directory | `./` |
| Build Command | `pnpm build` |
| Output Directory | `.next` |
| Install Command | `pnpm install` |

## 3. Configurar Variáveis de Ambiente

Na aba **Settings → Environment Variables**, adicione:

| Variável | Valor | Ambiente |
|----------|-------|----------|
| `UPSTASH_SEARCH_REST_URL` | `https://seu-indice.search.upstash.io` | Production + Preview |
| `UPSTASH_SEARCH_REST_TOKEN` | `seu-token-admin` | Production + Preview |
| `UPSTASH_SEARCH_REST_READONLY_TOKEN` | `seu-token-read-only` | Production + Preview |

> **Importante:** Use tokens diferentes para produção e desenvolvimento.

## 4. Popular Índice de Busca

Antes do deploy, execute localmente:

```bash
cp .env.example .env.local
# Edite .env.local com credenciais de produção
pnpm seed:search
```

## 5. Deploy

### Deploy Automático

Após conectar o repositório, a Vercel faz deploy automático a cada push na `main`.

### Deploy Manual (CLI)

```bash
# Instale Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy de preview
vercel

# Deploy de produção
vercel --prod
```

## 6. Verificar Deploy

- [ ] URL de produção abre sem erros
- [ ] Busca retorna resultados
- [ ] Dark mode funciona
- [ ] Analytics aparecem no dashboard da Vercel
- [ ] Logs não mostram erros no console

## 7. Domínio Customizado (Opcional)

1. Vá em **Project Settings → Domains**
2. Adicione seu domínio: `acervo-docente.com.br`
3. Configure DNS conforme instruções da Vercel
4. Aguarde propagação (até 48h)

## Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| Build falha com `UPSTASH_SEARCH_REST_TOKEN is missing` | Env vars não configuradas | Adicione em Settings → Environment Variables |
| Busca não retorna resultados | Índice Upstash vazio | Execute `pnpm seed:search` |
| Erro 500 em `/api/books` | Upstash indisponível | Verifique logs e fallback local |
| Analytics não aparece | NODE_ENV não é production | Deploy em produção (não preview) |

## Próximos Passos

- [Adicionar Livros](../guides/adding-books.md) — Popule o catálogo
- [Customizar Tema](../guides/customizing-theme.md) — Ajuste branding
- [Monitorar](https://vercel.com/docs/analytics) — Dashboard Vercel