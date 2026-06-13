import { books, type Book } from '@/lib/books'

export interface RandomBooksOptions {
  count?: number
  excludeIds?: string[]
  minTopics?: number
  maxTopics?: number
}

/**
 * Retorna N livros aleatórios do acervo
 * - Garante diversidade de temas (spread por principais_topicos)
 * - Evita duplicatas via excludeIds
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
 * Retorna livros aleatórios garantindo diversidade de tópicos
 * Tenta pegar no máximo 2 livros por tópico principal
 */
export function getDiverseRandomBooks(count = 10): Book[] {
  const topicsMap = new Map<string, Book[]>()

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