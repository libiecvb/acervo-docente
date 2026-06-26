# Configuração do Projeto

Guia de configuração para `next.config.mjs`, `tsconfig.json`, Tailwind e Vercel.

## Next.js (next.config.mjs)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone para Docker/deploy
  output: 'standalone',
  // Otimizações experimentais
  experimental: {
    // Turbopack habilitado por padrão em v16
  },
  // Redirects (se houver)
  // redirects() { ... }
}

export default nextConfig
```

### Configurações Recomendadas

| Opção | Valor | Descrição |
|-------|-------|-----------|
| `output: 'standalone'` | ✅ | Para Docker/Kubernetes |
| `trailingSlash` | ❌ | Não necessário |
| `images` | default | Sem `next/image` usage |
| `reactStrictMode` | default | Habilitado em dev |

## TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "moduleDetection": "force",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "types": ["node"],
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Paths Importantes

- `@/components/*` → `components/*`
- `@/lib/*` → `lib/*`
- `@/app/*` → `app/*`

## Tailwind CSS (tailwind.config.js)

O projeto usa **Tailwind CSS v4** com imports CSS:

```css
/* app/globals.css */
@import 'tailwindcss';
@import 'tw-animate-css';
@import 'shadcn/tailwind.css';
```

### Variáveis Customizadas

```css
/* OKLCH theme variables */
--color-primary: oklch(0.42 0.06 155);
--color-background: oklch(0.985 0.005 95);
--radius: 0.625rem;
```

## ESLint (.eslintrc.mjs)

Configuração padrão Next.js + integrações:

```javascript
// .eslintrc.mjs (se criado)
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default [{
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:tsdoc/recommended',
  ],
  plugins: ['@typescript-eslint', 'tsdoc'],
  rules: {
    'tsdoc/syntax': 'warn',
  }
}]
```

## Vercel (vercel.json)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {}
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

### Environment Variables (Vercel Dashboard)

| Nome | Valor | Tipo |
|------|-------|------|
| `UPSTASH_SEARCH_REST_URL` | URL do índice | Secret |
| `UPSTASH_SEARCH_REST_TOKEN` | Token admin | Secret |

## PostCSS (postcss.config.mjs)

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  }
}
```

## Components (components.json)

Configuração do shadcn/ui:

```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  }
}
```

## Referências

- [Next.js Config](https://nextjs.org/docs/app/building-your-application/configuring)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs/tailwind-config)
- [TypeScript with Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)