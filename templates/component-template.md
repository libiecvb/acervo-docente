# [Nome do Componente]

`import { [Nome] } from '@/components/[path]'`

## Descrição

Breve descrição do componente, seu propósito e quando usar.

## Props

| Prop | Tipo | Obrigatório | Padrão | Descrição |
|------|------|-------------|--------|-----------|
| `propName` | `string` | Não | `'default'` | Descrição |

## Variants (se aplicável)

| Variant | Descrição |
|---------|-----------|
| `default` | Descrição |
| `outline` | Descrição |
| `destructive` | Descrição |

## Sizes (se aplicável)

| Size | Descrição |
|------|-----------|
| `sm` | Pequeno |
| `default` | Padrão |
| `lg` | Grande |

## Estados

- **Default**: Aparência padrão
- **Hover**: Estado ao passar mouse
- **Focus**: Estado de foco (teclado)
- **Disabled**: Estado desabilitado
- **Loading**: Estado de carregamento (se aplicável)

## Exemplos

### Uso Básico

```tsx
import { [Nome] } from '@/components/[path]'

export function Example() {
  return <[Nome] propName="value" />
}
```

### Com Variants

```tsx
<[Nome] variant="outline" size="lg" />
```

## Acessibilidade

- [ ] `aria-label` ou `aria-labelledby` quando necessário
- [ ] Navegação por teclado (Tab, Enter, Escape)
- [ ] Contraste de cores (WCAG AA)
- [ ] Screen reader friendly
- [ ] `role` e `aria-*` attributes apropriados

## Testes

- [ ] Renderização básica
- [ ] Props obrigatórias
- [ ] Variants/sizes
- [ ] Estados (hover, focus, disabled)
- [ ] Acessibilidade (axe-core)
- [ ] Snapshots visuais

## Referências

- [Storybook](#) (se disponível)
- Componente base: `@base-ui/react/[component]`
- Design system: [link]