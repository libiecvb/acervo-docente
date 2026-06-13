import { SiteHeader } from "@/components/site-header"
import { BookCatalog } from "@/components/book-catalog"
import { books } from "@/lib/books"

export default function Page() {
  const total = books.length
  return (
    <main className="min-h-screen pb-20">
      <SiteHeader total={total} />
      <div className="pt-10">
        <BookCatalog initialTotal={total} initialQuery="Sabedoria" />
      </div>
    </main>
  )
}