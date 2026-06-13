export function SiteHeader({ total }: { total: number }) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Ferramenta de Apoio Pedagógico
        </p>
        <h1 className="mt-3 font-serif text-5xl font-medium leading-none tracking-tight text-foreground md:text-6xl text-balance">
          Acervo <span className="italic text-primary">Docente</span>
        </h1>
        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Catálogo para auxiliar os professores com recomendações pedagógicas de
          livros e planos de aula.
        </p>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-5 py-3">
          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Base de Dados Ativa
          </span>
          <span className="font-mono text-xs text-muted-foreground/70">
            · {total.toLocaleString("pt-BR")} títulos
          </span>
        </div>
      </div>
    </header>
  )
}
