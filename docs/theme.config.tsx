import type { DocsThemeConfig } from 'nextra-theme-docs'
import { BookOpen } from 'lucide-react'

const config: DocsThemeConfig = {
  logo: <><BookOpen className="h-5 w-5" /> <span>Acervo Docente</span></>,
  project: {
    link: 'https://github.com/seu-usuario/acervo-docente',
  },
  chat: {
    link: 'https://github.com/seu-usuario/acervo-docente/issues',
  },
  docsRepositoryBase: 'https://github.com/seu-usuario/acervo-docente/blob/main/docs',
  footer: {
    text: 'Acervo Docente — Documentação',
  },
  editLink: {
    text: 'Editar esta página no GitHub',
  },
  feedback: {
    content: 'Esta página foi útil?',
  },
  banner: {
    key: 'docs-v1',
    text: (
      <a href="/docs/getting-started/installation" target="_blank">
        Comece aqui → Guia de instalação
      </a>
    ),
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Acervo Docente — Documentação" />
      <meta property="og:description" content="Catálogo de livros para apoio pedagógico" />
    </>
  ),
  nextThemes: {
    defaultTheme: 'light',
    forcedTheme: 'light',
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s — Acervo Docente',
    }
  },
}

export default config
