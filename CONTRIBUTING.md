# Guia de Contribuição

Obrigado por contribuir para o **Acervo Docente**! Este guia estabelece padrões para código, commits, pull requests e documentação.

## Como Contribuir

### 1. Fork e Clone

```bash
git clone https://github.com/seu-usuario/acervo-docente.git
cd acervo-docente
```

### 2. Crie uma Branch

Use o padrão `tipo/escopo-descricao`:

```bash
git checkout -b feat/search-filter-author
git checkout -b fix/ui-dark-mode-contrast
git checkout -b docs/readme-quickstart
```

### 3. Instale Dependências

```bash
pnpm install
```

### 4. Faça Suas Alterações

- Mantenha commits pequenos e focados
- Escreva testes quando aplicável
- Atualize documentação quando necessário
- Siga os padrões de código abaixo

### 5. Valide Localmente

```bash
pnpm lint
pnpm build
```

### 6. Envie um Pull Request

- Abra um PR para `main`
- Descreva o que foi alterado
- Link issues relacionadas
- Aguarde revisão de pelo menos 1 mantenedor

---

## Padrões de Código

### TypeScript

- Use `strict: true` (configurado em `tsconfig.json`)
- Prefira tipos explícitos em props de componentes
- Use `type` para tipos estruturais, `interface` para contratos públicos
- Evite `any` — use `unknown` + type guards quando necessário
- Documente exports públicos com JSDoc/TSDoc

### React

- Use Server Components por padrão (App Router)
- Adicione `"use client"` apenas quando necessário (hooks, eventos, navegador)
- Prefira composição sobre props booleanas
- Use `aria-*` attributes para acessibilidade
- Mantenha componentes pequenos e reutilizáveis

### CSS / Tailwind

- Prefira classes utilitárias Tailwind
- Use CSS variables para temas (OKLCH em `globals.css`)
- Mantenha responsividade com breakpoints padrão (`sm`, `md`, `lg`, `xl`, `2xl`)
- Documente estilos customizados extensos

### Import Order

1. React/Next imports
2. External libraries
3. Internal aliases (`@/`)
4. CSS imports

```tsx
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Book } from '@/lib/books'
import './styles.css'
```

---

## Convenção de Commits

Este projeto segue [Conventional Commits](https://www.conventionalcommits.org/pt-BR/v1.0.0/):

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos

| Tipo | Quando Usar |
|------|-------------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Apenas documentação |
| `style` | Formatação (sem mudança de lógica) |
| `refactor` | Refatoração de código |
| `test` | Adição/correção de testes |
| `chore` | Build, deps, tooling |
| `perf` | Melhorias de performance |
| `a11y` | Melhorias de acessibilidade |

### Exemplos

```bash
git commit -m "feat(search): adiciona filtro por autor na API"
git commit -m "fix(ui): corrige contraste do botão no dark mode"
git commit -m "docs(readme): adiciona instruções de deploy"
git commit -m "chore(deps): atualiza Next.js para 16.2.6"
git commit -m "a11y(card): adiciona aria-label no botão de copiar"
```

---

## Processo de Pull Request

### Checklist do PR

Antes de abrir um PR, verifique:

- [ ] Código segue padrões de estilo
- [ ] `pnpm lint` passa localmente
- [ ] `pnpm build` passa localmente
- [ ] Testes adicionados/atualizados (quando aplicável)
- [ ] Documentação atualizada
- [ ] Commits seguem Conventional Commits
- [ ] Não há secrets/credenciais no código
- [ ] Branch é atualizada com `main` antes do merge

### Template de PR

```markdown
## Descrição

[O que foi alterado e por quê]

## Tipo de Mudança

- [ ] 🐛 Bug fix
- [ ] ✨ Nova funcionalidade
- [ ] 📝 Documentação
- [ ] ♿ Acessibilidade
- [ ] ⚡ Performance
- [ ] 🔧 Refatoração
- [ ] 🧪 Testes

## Como Testar

1. [ ] `pnpm install`
2. [ ] `pnpm lint`
3. [ ] `pnpm build`
4. [ ] [Passo específico da feature]

## Screenshots (se aplicável)

[Imagens antes/depois]

## Issues Relacionadas

Closes #123
```

---

## Documentação

### Quando Atualizar

Atualize documentação quando:

- Adicionar nova feature
- Alterar API pública
- Mudar comportamento existente
- Adicionar/remover variáveis de ambiente
- Alterar arquitetura
- Corrigir instruções desatualizadas

### Padrões

- Use português brasileiro
- Prefira frases curtas e diretas
- Inclua exemplos copiáveis
- Mantenha links atualizados
- Use templates em `templates/`

### Validação

```bash
# Se markdownlint estiver configurado:
pnpm lint:docs
```

---

## Testes

> **Status:** Não implementado ainda — planejado para futura sprint.

Quando implementado:

```bash
pnpm test          # Unit tests
pnpm test:e2e      # E2E tests
pnpm test:a11y     # Accessibility tests
```

---

## Segurança

- Nunca comite `.env.local`, tokens ou credenciais
- Use `.env.example` para documentar variáveis
- Reporte vulnerabilidades em [SECURITY.md](SECURITY.md)
- Valide inputs de usuário (especialmente em APIs)
- Use `rel="noopener noreferrer"` em links externos

---

## Code Review

### Expectativas

- Revise **o que** foi alterado e **por quê**
- Sugira melhorias, não apenas aponte problemas
- Valide acessibilidade e performance
- Teste localmente quando possível
- Seja respeitoso e construtivo

### Critérios de Merge

- ✅ Todos os checks do CI passando
- ✅ Pelo menos 1 aprovação
- ✅ Sem conflicts com `main`
- ✅ Documentação atualizada (se aplicável)

---

## Recursos

- [README.md](README.md)
- [CHANGELOG.md](CHANGELOG.md)
- [SECURITY.md](SECURITY.md)
- [Arquitetura](docs/architecture/overview.md)
- [ADRs](docs/architecture/adrs/)
- [Guia de API](docs/reference/api/books.md)

---

**Obrigado por ajudar a construir o Acervo Docente! 🙏**