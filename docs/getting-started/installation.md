# Instalação

> **Pré-requisitos:** Node.js 20+, pnpm 9+, Git
> **Tempo estimado:** 10 minutos
> **Nível:** Iniciante

Este guia mostra como configurar o **Acervo Docente** para desenvolvimento local.

## 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/acervo-docente.git
cd acervo-docente
```

## 2. Instalar Dependências

```bash
pnpm install
```

> **Nota:** Este projeto usa `pnpm` como gerenciador padrão. Se preferir npm:
>
> ```bash
> npm install
> ```

## 3. Configurar Variáveis de Ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```bash
# .env.local
UPSTASH_SEARCH_REST_URL="https://seu-indice.search.upstash.io"
UPSTASH_SEARCH_REST_TOKEN="seu-token-admin"
UPSTASH_SEARCH_REST_READONLY_TOKEN="seu-token-read-only"
```

> **Atenção:** Nunca comite `.env.local` — ele está no `.gitignore`.

## 4. Rodar em Desenvolvimento

```bash
pnpm dev
```

Acesse: http://localhost:3000

## 5. Verificar Instalação

- [ ] O servidor inicia sem erros
- [ ] A página inicial carrega em http://localhost:3000
- [ ] A busca retorna resultados
- [ ] O dark mode respeita `prefers-color-scheme`

## Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| `pnpm: command not found` | pnpm não instalado | `npm install -g pnpm` |
| `UPSTASH_SEARCH_REST_TOKEN is missing` | `.env.local` não configurado | Copie `.env.example` e preencha |
| `Module not found: @/...` | `tsconfig.json` não carregado | Reinicie o servidor |
| `Port 3000 in use` | Outra instância rodando | `lsof -ti:3000 | xargs kill -9` |

## Próximos Passos

- [Desenvolvimento](development.md) — Entenda a estrutura do projeto
- [Deploy](deployment.md) — Publique na Vercel
- [Adicionar Livros](../guides/adding-books.md) — Popule o catálogo