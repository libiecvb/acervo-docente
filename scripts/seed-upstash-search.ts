import { Search } from '@upstash/search'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Carregar variáveis de ambiente do .env.local
config({ path: path.join(__dirname, '../.env.local') })

interface Book {
  id: string
  titulo: string
  autor: string
  resumo: string
  principais_topicos: string
  link: string
}

// Cliente Upstash Search - o nome do índice vem da URL: loving-possum-40689-gcp-usc1-search.upstash.io
const INDEX_NAME = 'loving-possum-40689'

const search = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL!,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN!,
})

const index = search.index(INDEX_NAME)

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

async function main() {
  console.log('📖 Lendo books.json...')
  const filePath = path.join(__dirname, '../data/books.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const books: Book[] = JSON.parse(raw)

  console.log(`📚 ${books.length} livros encontrados`)

  console.log('🚀 Iniciando upsert em batches...')
  const BATCH_SIZE = 100
  let success = 0
  let errors = 0

  for (let i = 0; i < books.length; i += BATCH_SIZE) {
    const batch = books.slice(i, i + BATCH_SIZE)
    try {
      // O upsert espera content como objeto {text: "..."}
      const upsertParams = batch.map((book) => {
        const searchText = `${book.titulo} ${book.autor} ${book.resumo} ${book.principais_topicos}`
        const topicsArray = book.principais_topicos.split(',').map((t) => t.trim()).filter(Boolean)
        const autorNormalized = normalize(book.autor)

        return {
          id: book.id,
          content: { text: searchText },
          metadata: {
            titulo: book.titulo,
            autor: book.autor,
            resumo: book.resumo,
            principais_topicos: book.principais_topicos,
            link: book.link,
            topics_array: topicsArray,
            autor_normalized: autorNormalized,
          },
        }
      })
      await index.upsert(upsertParams)
      success += batch.length
      console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${success}/${books.length}`)
    } catch (err) {
      errors += batch.length
      console.error(`❌ Erro no batch ${Math.floor(i / BATCH_SIZE) + 1}:`, err)
    }

    // Rate limiting - respeita limites do Upstash
    if (i + BATCH_SIZE < books.length) {
      await new Promise((r) => setTimeout(r, 150))
    }
  }

  console.log(`\n🎉 Concluído! Sucesso: ${success}, Erros: ${errors}`)

  // Verificação rápida
  try {
    const test = await index.search({ query: 'teologia', limit: 3 })
    console.log('\n🔍 Teste de busca:', test.map((r) => r.metadata?.titulo))
  } catch (err) {
    console.error('⚠️ Erro no teste de busca:', err)
  }
}

main().catch(console.error)