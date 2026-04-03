/**
 * Normalize catalog: strip duplicate "library copy" rows, fix anonymous authors,
 * assign sequential ISBNs (978-01-XXXXXXXXX).
 *
 * Run: node scripts/regenerate-books-catalog.cjs
 */
const fs = require("fs")
const path = require("path")

const root = path.join(__dirname, "..")
const booksPath = path.join(root, "src/data/books.json")
const authorsPath = path.join(root, "src/data/authors.json")

const copyTitleRe = /\s+— Library copy [234]$/

const raw = JSON.parse(fs.readFileSync(booksPath, "utf8"))
const authors = JSON.parse(fs.readFileSync(authorsPath, "utf8"))

/** One row per title + author (keeps the row without a "Library copy" suffix when present). */
function dedupeLibraryCopies(books) {
  const groups = new Map()
  for (const b of books) {
    const baseTitle = b.title.replace(copyTitleRe, "")
    const key = `${baseTitle}\0${b.authorId || ""}\0${b.author}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(b)
  }
  const out = []
  for (const [, list] of groups) {
    const primary =
      list.find((b) => !copyTitleRe.test(b.title)) ||
      [...list].sort((a, b) => a.isbn.localeCompare(b.isbn))[0]
    out.push({ ...primary, title: primary.title.replace(copyTitleRe, "") })
  }
  return out
}

const deduped = dedupeLibraryCopies(raw)

const authorPool = authors.map((a) => ({ id: a.id, name: a.name }))

function descriptionLine(title, authorName) {
  const safe = String(title).replace(/"/g, '\\"')
  return `A classic work titled "${safe}" by ${authorName}.`
}

let anonIdx = 0
const fixed = deduped.map((book) => {
  if (book.author === "Anonymous" || book.authorId === "anonymous") {
    const a = authorPool[anonIdx % authorPool.length]
    anonIdx++
    return {
      ...book,
      author: a.name,
      authorId: a.id,
      description: {
        description: descriptionLine(book.title, a.name),
      },
    }
  }
  return book
})

fixed.sort((a, b) =>
  a.isbn.replace(/-/g, "").localeCompare(b.isbn.replace(/-/g, ""), undefined, {
    numeric: true,
  })
)

const out = fixed.map((book, i) => {
  const tail = String(i).padStart(9, "0")
  return {
    ...book,
    isbn: `978-01-${tail}`,
  }
})

const anonLeft = out.filter(
  (b) =>
    !b.author ||
    !b.authorId ||
    /anonymous/i.test(b.author) ||
    b.authorId === "anonymous"
)

if (anonLeft.length > 0) {
  console.error("Still anonymous:", anonLeft.length)
  process.exit(1)
}

if (out.some((b) => copyTitleRe.test(b.title))) {
  console.error("Library copy titles still present after dedupe")
  process.exit(1)
}

const isbns = new Set(out.map((b) => b.isbn))
if (isbns.size !== out.length) {
  console.error("Duplicate ISBNs")
  process.exit(1)
}

fs.writeFileSync(booksPath, JSON.stringify(out, null, 2) + "\n")
console.log("Wrote", out.length, "books")
