"use client"

import { useState, useEffect, useCallback } from "react"
import useSWR from "swr"
import { Loader2, RefreshCw, Sparkles, BookOpen, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookCard } from "@/components/book-card"
import type { Book } from "@/lib/books"

const fetcher = (url: string) => fetch(url).then(r => r.json())

const STORAGE_KEY = "acervo-docente:highlights-seed"
const STORAGE_VERSION = 1

interface HomeHighlightsProps {
  /** Initial books to display before API response */
  initialBooks: Book[]
}

/**
 * Home highlights section with persistent random book selection.
 *
 * @remarks
 * Features:
 * - Persistent random selection via localStorage seed
 * - Topic-diverse books from `/api/random-books`
 * - Refresh button to get new selection
 * - Reset button to return to original selection
 * - 1-hour SWR cache deduplication
 * - Fallback to initialBooks during loading
 *
 * The seed is stored in localStorage and persists across sessions.
 * Incrementing the seed triggers a new random selection from the API.
 *
 * @param props - Component props
 * @param props.initialBooks - Initial books for SSR/fallback
 *
 * @public
 */
export function HomeHighlights({ initialBooks }: HomeHighlightsProps) {
  // Inicializa seed do localStorage (ou 0 se não existe)
  const [seed, setSeed] = useState<number>(() => {
    if (typeof window === "undefined") return 0
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.version === STORAGE_VERSION && typeof parsed.seed === "number") {
          return parsed.seed
        }
      }
    } catch {
      // Ignora erros de parsing
    }
    return 0
  })

  // Persiste seed no localStorage quando muda
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: STORAGE_VERSION,
        seed,
        updatedAt: new Date().toISOString(),
      }))
    } catch {
      // Ignora erros de storage (ex: quota exceeded)
    }
  }, [seed])

  const { data, isLoading, mutate } = useSWR<{ books: Book[] }>(
    `/api/random-books?count=10&seed=${seed}`,
    fetcher,
    {
      fallbackData: { books: initialBooks },
      dedupingInterval: 60 * 60 * 1000, // 1 hora de cache
      revalidateOnFocus: false,
    }
  )

  const books = data?.books ?? initialBooks
  const isRefreshing = isLoading && !!data

  // Gera novo seed e força refresh
  const handleRefresh = useCallback(async () => {
    setSeed(s => s + 1)
    await mutate()
  }, [mutate])

  // Reseta para seed inicial (limpa localStorage)
  const handleReset = useCallback(async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
    setSeed(0)
    await mutate()
  }, [mutate])

  return (
    <section className="mx-auto max-w-5xl px-5 py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="size-5 text-amber-500" />
            <h2 className="font-serif text-2xl font-medium text-foreground">
              Destaques da Semana
            </h2>
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            Seleção aleatória de {books.length} títulos — mantida estável nesta sessão
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            {isRefreshing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Atualizar seleção
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={isRefreshing}
            className="gap-2"
            title="Voltar à seleção original"
          >
            <RotateCcw className="size-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book) => (
          <article key={book.id} className="group">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="font-mono text-xs">
                <BookOpen className="size-2.5 mr-1" />
                Destaque
              </Badge>
            </div>
            <BookCard book={book} />
          </article>
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-8 text-center font-mono text-xs text-muted-foreground/60">
        A seleção persiste durante sua navegação.{" "}
        <Button variant="ghost" size="sm" className="px-2 py-0" onClick={handleRefresh}>
          Nova seleção
        </Button>
        {" | "}
        <Button variant="ghost" size="sm" className="px-2 py-0" onClick={handleReset}>
          Reset
        </Button>
      </p>
    </section>
  )
}