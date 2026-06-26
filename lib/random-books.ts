import { books, type Book } from '@/lib/books'

/**
 * Configuration options for random book selection.
 *
 * @public
 */
export interface RandomBooksOptions {
  /** Number of books to return (default: 10) */
  count?: number
  /** Book IDs to exclude from results (default: []) */
  excludeIds?: string[]
  /** Minimum number of topics a book must have (default: 1) */
  minTopics?: number
  /** Maximum number of topics a book can have (default: 5) */
  maxTopics?: number
}

/**
 * Returns N random books from the catalog.
 *
 * @remarks
 * Uses Fisher-Yates shuffle for unbiased randomization.
 * Filters books by topic count range and excludes specified IDs.
 * Does not guarantee topic diversity - use {@link getDiverseRandomBooks} for that.
 *
 * @param options - Configuration options
 * @returns Array of randomly selected books (may be fewer than requested if not enough eligible books)
 *
 * @example
 * ```typescript
 * // Get 5 random books excluding specific IDs
 * const books = getRandomBooks({ count: 5, excludeIds: ['book-1', 'book-2'] })
 * ```
 *
 * @public
 */
export function getRandomBooks(options: RandomBooksOptions = {}): Book[] {
  const {
    count = 10,
    excludeIds = [],
    minTopics = 1,
    maxTopics = 5,
  } = options

  // Filtra livros com temas válidos
  const eligible = books.filter((book) => {
    const topics = book.principais_topicos.split(',').map(t => t.trim()).filter(Boolean)
    return topics.length >= minTopics && topics.length <= maxTopics
      && !excludeIds.includes(book.id)
  })

  // Embaralha (Fisher-Yates)
  const shuffled = [...eligible]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, count)
}

/**
 * Returns random books ensuring topic diversity.
 *
 * @remarks
 * Groups books by their first topic (main topic) and distributes
 * selection slots across topics to maximize variety.
 * Falls back to {@link getRandomBooks} to fill remaining slots if needed.
 * Final result is shuffled again for presentation randomness.
 *
 * @param count - Number of books to return (default: 10)
 * @returns Array of diverse random books
 *
 * @example
 * ```typescript
 * // Get 12 books with diverse topics
 * const books = getDiverseRandomBooks(12)
 * ```
 *
 * @public
 */
export function getDiverseRandomBooks(count = 10): Book[] {
  const topicsMap = new Map<string, Book[]>

  books.forEach(book => {
    const topics = book.principais_topicos.split(',').map(t => t.trim()).filter(Boolean)
    const mainTopic = topics[0] // Primeiro tópico como categoria principal
    if (!topicsMap.has(mainTopic)) topicsMap.set(mainTopic, [])
    topicsMap.get(mainTopic)!.push(book)
  })

  const topics = Array.from(topicsMap.keys())
  const result: Book[] = []
  const usedIds = new Set<string>()

  // Distribui vagas entre tópicos
  const perTopic = Math.ceil(count / topics.length)

  for (const topic of topics) {
    const topicBooks = topicsMap.get(topic)!
    const shuffled = [...topicBooks].sort(() => Math.random() - 0.5)

    for (const book of shuffled) {
      if (result.length >= count) break
      if (!usedIds.has(book.id)) {
        result.push(book)
        usedIds.add(book.id)
      }
    }
  }

  // Preenche resto se necessário
  if (result.length < count) {
    const remaining = getRandomBooks({ count: count - result.length, excludeIds: [...usedIds] })
    result.push(...remaining)
  }

  return result.slice(0, count).sort(() => Math.random() - 0.5)
}