# Customizar Tema

> **Pré-requisitos:** Conhecimento básico de CSS
> **Tempo estimado:** 15 minutos
> **Nível:** Intermediário

Este guia mostra como customizar cores, fontes e comportamento do tema no Acervo Docente.

## Estrutura de Variáveis (CSS)

O projeto usa **CSS Variables (OKLCH)** em `app/globals.css`:

```css
/* Light mode */
:root {
  --background: oklch(0.985 0.005 95);
  --foreground: oklch(0.25 0.01 90);
  --primary: oklch(0.42 0.06 155);
  --radius: 0.625rem;
}

/* Dark mode */
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
}
```

## Cores

### Primary Color

Usada para botões, badges e elementos de destaque.

**Localização:** `--primary`, `--primary-foreground`

```css
/* Exemplo: tema verde */
--primary: oklch(0.45 0.15 150);
--primary-foreground: oklch(0.985 0.005 95);
```

> **Dica:** Use ferramentas como [OKLCH Color Picker](https://oklch.com) para ajustar cores.

### Background/Card Colors

```css
--background: oklch(...);  /* Fundo da página */
--card: oklch(...);        /* Fundo dos cards */
--border: oklch(...);       /* Bordas */
--muted: oklch(...);        /* Elementos secundários */
```

## Fontes

### Fontes Atuais

- **Heading/Title:** Playfair Display (serif)
- **Body:** Geist Sans (sans-serif)
- **Code:** Geist Mono

### Adicionar Fonte Customizada

1. Instale via Google Fonts no `app/layout.tsx`:

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})
```

2. Atualize CSS variables:

```css
--font-serif: var(--font-inter), 'Georgia', serif;
```

## Dark Mode

### Comportamento Automático

O projeto respeita `prefers-color-scheme` automaticamente:

```css
@media (prefers-color-scheme: dark) {
  /* Aplica .dark se não houver override */
}
```

### Forçar Modo Escuro

Adicione `.dark` ao `<html>` via script ou:

```tsx
// app/layout.tsx
<html className="dark">
```

## Border Radius

```css
--radius: 0.625rem;  /* 10px base */
--radius-sm: calc(var(--radius) * 0.6);
--radius-md: calc(var(--radius) * 0.8);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) * 1.4);
```

**Exemplo: tema mais arredondado**

```css
--radius: 1rem;
--radius-xl: calc(var(--radius) * 1.5);
```

## Variáveis do Tema Shadcn/UI

O arquivo `app/globals.css` inclui variáveis do shadcn/ui:

| Variável | Uso |
|----------|-----|
| `--sidebar-*` | Sidebar components |
| `--chart-*` | Charts/graphs |
| `--input` | Input borders |
| `--ring` | Focus ring |

## Custom Components

### Adicionar Shadow

```css
:root {
  --shadow-card: 0 1px 3px 0 oklch(0 0 0 / 0.1);
  --shadow-modal: 0 10px 15px -3px oklch(0 0 0 / 0.1);
}

.shadow-card {
  box-shadow: var(--shadow-card);
}
```

### Animações Custom

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

## Pré-visualização

Use o DevTools para testar mudanças:

1. Abra **Elements** → **:root**
2. Edite valores de variáveis em tempo real
3. Veja mudanças imediatamente

## Checklist

- [ ] Cores com contraste adequado (WCAG AA)
- [ ] Dark mode testado em ambos os temas
- [ ] Fontes carregadas corretamente
- [ ] Radius consistente entre componentes
- [ ] Shadows funcionam em ambos os modos

## Próximos Passos

- [Guia de Accessibility](troubleshooting.md#a11y) — Contraste e semântica
- [Componentes UI](../reference/components/ui.md) — Classes e variants