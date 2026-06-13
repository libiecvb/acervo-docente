"use client"

import { useState } from "react"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ChevronDown, Copy, Check } from "lucide-react"
import { getTopics, type Book } from "@/lib/books"

export function BookCard({ book }: { book: Book }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const topics = getTopics(book)

  async function copyInfo() {
    await navigator.clipboard.writeText(
      `${book.titulo} — ${book.autor}\n\n${book.resumo}`,
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article className="flex flex-col border-t border-border py-6">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="font-serif text-xl font-medium leading-snug text-foreground text-pretty">
          {book.titulo}
        </h3>
        <button
          type="button"
          onClick={copyInfo}
          aria-label="Copiar informações do livro"
          className="mt-1 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? (
            <Check className="size-4 text-primary" />
          ) : (
            <Copy className="size-4" />
          )}
        </button>
      </div>

      <p className="font-serif text-sm italic text-muted-foreground">
        {book.autor}
      </p>

      <p
        className={`mt-3 text-sm leading-relaxed text-foreground/80 ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {book.resumo}
      </p>

      {expanded && topics.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Principais Tópicos
          </p>
          <div className="flex flex-wrap gap-1.5">
            {topics.map((topic, i) => (
              <Badge key={i} variant="secondary" className="font-normal h-auto max-w-full whitespace-normal break-words text-left">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 inline-flex w-fit items-center gap-1 font-mono text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
      >
        {expanded ? "Recolher" : "Ver resumo"}
        <ChevronDown
          className={`size-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs text-muted-foreground/70">
          ID: #{book.id}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={book.link}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}
          >
            Acessar
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>
    </article>
  )
}
