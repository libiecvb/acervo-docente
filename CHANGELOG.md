# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere a [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Adicionado
- Documentação completa do projeto (README, guias, API reference, arquitetura)
- Templates para ADRs, endpoints de API, componentes e guias
- Configuração de markdownlint
- Estrutura de pastas `docs/` seguindo Diátaxis
- Arquivo `.env.example` com template de variáveis de ambiente

### Alterado
- Atualizado `package.json` com metadados corretos (name, description, repository)

### Corrigido
- N/A

## [0.1.0] - 2026-06-21

### Adicionado
- Catálogo de livros com busca híbrida (Upstash + fallback local)
- Interface responsiva com Tailwind CSS v4 e dark mode automático
- Componentes UI baseados em `@base-ui/react` (Button, Badge, Skeleton, Dialog)
- Busca com debounce (300ms) e paginação infinita via SWR
- Cards de livro expansíveis com copy-to-clipboard e link externo
- Header com contador de títulos formatado em pt-BR
- Script de seeding para Upstash Search (`pnpm seed:search`)
- Analytics via `@vercel/analytics` (apenas produção)
- Fontes otimizadas com `next/font` (Geist + Playfair Display)
- TypeScript strict mode configurado
- ESLint com plugin tsdoc

### Alterado
- N/A (versão inicial)

### Corrigido
- N/A

### Removido
- N/A

---

## Guia de Versões

### Tipos de Mudança

- **Adicionado** — Novas funcionalidades
- **Alterado** — Mudanças em funcionalidades existentes
- **Obsoleto** — Funcionalidades que serão removidas
- **Removido** — Funcionalidades removidas
- **Corrigido** — Correções de bugs
- **Segurança** — Correções de vulnerabilidades

### Versionamento Semântico

Dado um número de versão `MAJOR.MINOR.PATCH` (ex: `1.2.3`):

- **MAJOR** — Mudanças incompatíveis na API
- **MINOR** — Funcionalidades compatíveis com versões anteriores
- **PATCH** — Correções de bugs compatíveis com versões anteriores

### Convenção de Commits

Este projeto segue [Conventional Commits](https://www.conventionalcommits.org/pt-BR/v1.0.0/):

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Apenas documentação
- `style`: Formatação (sem mudança de lógica)
- `refactor`: Refatoração de código
- `test`: Adição/correção de testes
- `chore`: Manutenção (build, deps, etc.)

**Exemplos:**
```
feat(search): adiciona filtro por autor na API
fix(ui): corrige contraste do botão no dark mode
docs(readme): adiciona instruções de deploy
chore(deps): atualiza Next.js para 16.2.6
```