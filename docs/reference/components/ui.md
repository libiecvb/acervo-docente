# Componentes UI

Componentes primitivos (shadcn/ui style) usando `@base-ui/react`.

## Button

`<Button />` — Botão com variants e sizes.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | `"default" \| "outline" \| "secondary" \| "ghost" \| "destructive" \| "link"` | `"default"` | Estilo visual |
| `size` | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` | `"default"` | Tamanho do botão |
| `disabled` | `boolean` | `false` | Desabilita interação |
| `className` | `string` | - | Classes Tailwind adicionais |

### Variants

```tsx
<Button variant="default">Primário</Button>
<Button variant="outline">Secundário</Button>
<Button variant="secondary">Terciário</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destrutivo</Button>
<Button variant="link">Link</Button>
```

### Sizes

```tsx
<Button size="xs">XS</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Search /></Button>
```

### Exemplo

```tsx
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function LoadingButton({ loading }: { loading: boolean }) {
  return (
    <Button disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Carregar mais
    </Button>
  )
}
```

---

## Badge

`<Badge />` — Tag/insignia para tópicos e categorias.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | `"default" \| "secondary" \| "outline" \| "destructive" \| "ghost" \| "link"` | `"default"` | Estilo visual |
| `className` | `string` | - | Classes adicionais |

### Exemplo

```tsx
import { Badge } from '@/components/ui/badge'

<TopicsList topics={['Filosofia', 'Ética', 'Sabedoria']} />

function TopicsList({ topics }: { topics: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {topics.map((topic) => (
        <Badge key={topic} variant="secondary">
          {topic}
        </Badge>
      ))}
    </div>
  )
}
```

---

## Skeleton

`<Skeleton />` — Placeholder animado para loading states.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `className` | `string` | - | Classes de tamanho/posição |

### Exemplo

```tsx
import { Skeleton } from '@/components/ui/skeleton'

<div className="space-y-2">
  <Skeleton className="h-6 w-3/4" />
  <Skeleton className="h-4 w-1/3" />
  <Skeleton className="h-16 w-full" />
</div>
```

---

## Dialog

`<Dialog />` — Modal/dialog usando Base UI.

### Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `open` | `boolean` | Controla visibilidade |
| `onOpenChange` | `(open: boolean) => void` | Callback de mudança |
| `trigger` | `ReactNode` | Elemento que abre |
| `title` | `string` | Título do dialog |

### Exemplo

```tsx
import { Dialog } from '@/components/ui/dialog'

<Dialog
  trigger={<Button>Ver mais</Button>}
  title="Detalhes do Livro"
>
  <p>Conteúdo do dialog...</p>
</Dialog>
```

## Acessibilidade

Todos os componentes UI incluem:

- [x] `aria-*` attributes apropriados
- [x] Foco visível via teclado
- [x] Contraste WCAG AA
- [x] Screen reader friendly
- [x] `type="button"` em botões