"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import useSWR from "swr"
import { Search, Loader2, AlertCircle, RefreshCw, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BookCard } from "@/components/book-card"
import type { Book } from "@/lib/books"

interface SearchError {
  error: string
  code: 'UPSTASH_UNAVAILABLE' | 'RATE_LIMITED' | 'NETWORK_ERROR' | 'INTERNAL_ERROR'
  retryable: boolean
}

interface ApiResponse {
  items: Book[]
  total: number
  page: number
  hasMore: boolean
  error?: string
  code?: SearchError['code']
  retryable?: boolean
}

const fetcher = async (url: string): Promise<ApiResponse> => {
  const res = await fetch(url)
  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data.error || 'Erro na busca')
    ;(err as any).code = data.code
    ;(err as any).retryable = data.retryable
    throw err
  }

  return data
}

/**
 * Custom hook for debouncing a value.
 *
 * @param value - The value to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced value
 *
 * @internal
 */
function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

interface BookCatalogProps {
  /** Initial total book count (used before first API response) */
  initialTotal: number
  /** Optional initial search query */
  initialQuery?: string
}

/**
 * Book catalog component with search, pagination, and infinite scroll.
 *
 * @remarks
 * Features:
 * - Debounced search input (300ms)
 * - Server-side pagination via API
 * - Accumulated results (load more pattern)
 * - Skeleton loading states
 * - Empty state handling
 *
 * Uses SWR for data fetching with `keepPreviousData` for smooth pagination.
 *
 * @param props - Component props
 * @param props.initialTotal - Initial total count for pre-rendering
 * @param props.initialQuery - Optional initial search query
 *
 * @public
 */
export function BookCatalog({ initialTotal, initialQuery = "" }: BookCatalogProps) {
  const [query, setQuery] = useState(initialQuery)
  const [page, setPage] = useState(1)
  const [accumulated, setAccumulated] = useState<Book[]>([])
  const debouncedQuery = useDebounced(query, 300)

  // Reset pagination when the search term changes
  useEffect(() => {
    setPage(1)
    setAccumulated([])
  }, [debouncedQuery])

  const { data, isLoading, error: swrError, mutate } = useSWR<ApiResponse>(
    debouncedQuery ? `/api/books?q=${encodeURIComponent(debouncedQuery)}&page=${page}` : null,
    fetcher,
    { keepPreviousData: true }
  )

  const isErrorState = !!swrError
  const errorInfo: SearchError | null = swrError ? {
    error: swrError.message,
    code: (swrError as any).code ?? 'INTERNAL_ERROR',
    retryable: (swrError as any).retryable ?? true
  } : null

  useEffect(() => {
    if (!data || isErrorState) return
    setAccumulated((prev) =>
      data.page === 1 ? data.items : [...prev, ...data.items],
    )
  }, [data, isErrorState])

  const total = data?.total ?? initialTotal
  const hasMore = data?.hasMore ?? false
  const showingInitialSkeleton = isLoading && accumulated.length === 0 && !isErrorState

  const resultLabel = useMemo(() => {
    if (isErrorState) return "Erro ao carregar"
    return `${total.toLocaleString("pt-BR")} ${total === 1 ? "listado" : "listados"}`
  }, [total, isErrorState])

  const handleRetry = useCallback(() => {
    mutate()
  }, [mutate])

  return (
    <div className="mx-auto max-w-5xl px-5">
      {/* Search */}
      <section className="rounded-lg border border-border bg-card p-5 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Search className="size-4 text-primary" />
          <h2 className="font-mono text-sm font-medium uppercase tracking-[0.15em] text-foreground">
            Filtrar Livros
          </h2>
        </div>
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar por título, autor, categoria..."
            aria-label="Pesquisar livros"
            className="w-full border-b-2 border-border bg-transparent pb-3 pr-10 font-serif text-lg text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              <Search className="size-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </section>

      {/* Results header */}
      <div className="mb-2 mt-10 flex items-baseline gap-2 border-b border-border pb-3">
        <h2 className="font-serif text-2xl font-medium text-foreground">
          {isErrorState ? "Erro na Busca" : "Resultados da Pesquisa"}
        </h2>
        <span className="font-mono text-sm text-muted-foreground">
          ({resultLabel})
        </span>
      </div>

      {/* Error State - PRIORIDADE ALTA */}
      {isErrorState && errorInfo ? (
        <div className="py-16 text-center border border-destructive/20 rounded-lg bg-destructive/5">
          <div className="mx-auto mb-4 size-12 flex items-center justify-center rounded-full bg-destructive/10">
            {errorInfo.code === 'NETWORK_ERROR' || errorInfo.code === 'UPSTASH_UNAVAILABLE' ? (
              <WifiOff className="size-6 text-destructive" />
            ) : (
              <AlertCircle className="size-6 text-destructive" />
            )}
          </div>
          <p className="font-serif text-lg text-foreground mb-2">
            {errorInfo.error}
          </p>
          {errorInfo.retryable && (
            <Button
              variant="default"
              onClick={handleRetry}
              className="gap-2"
              disabled={isLoading}
            >
              <RefreshCw className="size-4" />
              Tentar Novamente
            </Button>
          )}
        </div>
      ) : showingInitialSkeleton ? (
        <div className="grid gap-x-10 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-t border-border py-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="mt-3 h-4 w-1/3" />
              <Skeleton className="mt-4 h-16 w-full" />
            </div>
          ))}
        </div>
      ) : accumulated.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-serif text-lg text-foreground">
            Nenhum livro encontrado
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente outros termos de busca.
          </p>
        </div>
      ) : (
        <div className="grid gap-x-10 md:grid-cols-2">
          {accumulated.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && accumulated.length > 0 && !isErrorState && (
        <div className="flex justify-center border-t border-border py-10">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            Carregar mais títulos
          </Button>
        </div>
      )}
    </div>
  )
}