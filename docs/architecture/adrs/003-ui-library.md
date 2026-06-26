# ADR 003: @base-ui/react vs Radix UI

**Status:** Aceito
**Data:** 2026-06-12
**Autor:** Claude Code
**Decidores:** Equipe de desenvolvimento

## Contexto

Precisávamos de uma biblioteca de componentes headless para:

- Botões, badges, skeleton, dialog
- Acessibilidade garantida (ARIA, keyboard nav)
- Customização total de estilos
- Bundle size pequeno

Alternativas:

1. **@base-ui/react** (shadcn/ui v4)
2. **Radix UI** (shadcn/ui v3)
3. **Headless UI** (Tailwind Labs)
4. **Build from scratch** (divs + ARIA manual)

## Decisão

Escolhemos **@base-ui/react** como primitivas UI.

**Justificativa:**

- Shadcn/ui v4 recomenda `@base-ui/react`
- API mais enxuta que Radix
- Bundle size similar (~15KB vs ~20KB)
- `useRender` hook para patterns avançados
- `mergeProps` utility

## Consequências

### Positivas

- API `useRender` permite patterns flexíveis
- Menor boilerplate que Radix
- Compatível com Tailwind CSS v4
- Mantido por equipe do shadcn

### Negativas

- Menos documentação que Radix
- Comunidade menor
- Mudanças recentes (breaking em minor versions)

### Riscos

- Depreciação futura
- Migração Radix → Base UI não trivial
- Bugs em versões early (v1.5.0)

## Implementação


```tsx
// components/ui/button.tsx
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva } from 'class-variance-authority'

const buttonVariants = cva('...', { variants: {...} })

function Button({ className, variant, ...props }) {
  return <ButtonPrimitive className={cn(buttonVariants({ variant }))} {...props} />
}
```

## Alternativas Consideradas

| Alternativa | Prós | Contras | Decisão |
|-------------|------|---------|---------|
| Radix UI | Docs excelentes, comunidade | Boilerplate verboso, maior bundle | Rejeitado |
| Headless UI | Tailwind labs, maduro | Menos components, Vue focus | Rejeitado |
| @base-ui/react | API enxuta, shadcn v4 | Docs limitadas | ✅ Escolhido |
| Próprio | Zero deps | Manutenção pesada | Rejeitado |

## Status

- ✅ Button implementado
- ✅ Badge implementado
- ✅ Skeleton implementado
- ⏳ Dialog implementado (verificar)

## Referências

- [@base-ui/react](https://base-ui.com)
- [shadcn/ui v4](https://ui.shadcn.com/docs/components)
- [Radix UI Migration Guide](https://www.radix-ui.com/primitives)