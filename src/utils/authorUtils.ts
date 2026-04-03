import authors from '../data/authors.json';
import books from '../data/books.json';

export interface Author {
  id: string;
  name: string;
  fullName: string;
  birthYear: number | null;
  deathYear: number | null;
  nationality: string | null;
  genres: string[];
  bio: string | null;
  website: string | null;
  image: string | null;
}

export interface BookWithAuthorId {
  title: string;
  author: string;
  authorId: string;
  description: {
    description: string;
  };
  isbn: string;
  image: string | null;
  communityRating: number;
  userRating: number | null;
  genres: string[];
  progress: number;
  dateStarted: string | null;
  dateFinished: string | null;
  pages?: number;
}

/**
 * Get author by ID
 */
export const getAuthorById = (id: string): Author | undefined => {
  return authors.find(author => author.id === id);
};

/**
 * Get author by name
 */
export const getAuthorByName = (name: string): Author | undefined => {
  return authors.find(author => author.name === name);
};

/**
 * Get all books by a specific author
 */
export const getBooksByAuthor = (authorId: string): BookWithAuthorId[] => {
  return books.filter(book => book.authorId === authorId);
};

/**
 * Get all books by author name
 */
export const getBooksByAuthorName = (authorName: string): BookWithAuthorId[] => {
  return books.filter(book => book.author === authorName);
};

/**
 * Get author with their books
 */
export const getAuthorWithBooks = (authorId: string): (Author & { books: BookWithAuthorId[] }) | undefined => {
  const author = getAuthorById(authorId);
  if (!author) return undefined;

  const authorBooks = getBooksByAuthor(authorId);
  return {
    ...author,
    books: authorBooks
  };
};

/**
 * Search authors by name, bio, or genres
 */
export const searchAuthors = (query: string): Author[] => {
  const lowerQuery = query.toLowerCase();
  return authors.filter(author => 
    author.name.toLowerCase().includes(lowerQuery) ||
    author.fullName.toLowerCase().includes(lowerQuery) ||
    author.bio?.toLowerCase().includes(lowerQuery) ||
    author.genres.some(genre => genre.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Get authors by nationality
 */
export const getAuthorsByNationality = (nationality: string): Author[] => {
  return authors.filter(author => author.nationality === nationality);
};

/**
 * Get authors by genre
 */
export const getAuthorsByGenre = (genre: string): Author[] => {
  return authors.filter(author => 
    author.genres.some(g => g.toLowerCase().includes(genre.toLowerCase()))
  );
};

/**
 * Get all unique nationalities
 */
export const getAllNationalities = (): string[] => {
  const nationalities = authors
    .map(author => author.nationality)
    .filter((nationality): nationality is string => nationality !== null);
  return [...new Set(nationalities)].sort();
};

/**
 * Get all unique genres from authors
 */
export const getAllAuthorGenres = (): string[] => {
  const allGenres = authors.flatMap(author => author.genres);
  return [...new Set(allGenres)].sort();
};

/**
 * Get all unique genres from books
 */
export const getAllBookGenres = (): string[] => {
  const allGenres = books.flatMap(book => book.genres);
  return [...new Set(allGenres)].sort();
};

/**
 * Get all books by genre (exact string match on book.genres only)
 */
export const getBooksByGenre = (genre: string): BookWithAuthorId[] => {
  return books.filter(book => book.genres.includes(genre));
};

/** One row per distinct author contributing to a book list (for genre stats). */
export interface BookAuthorSummary {
  key: string;
  name: string;
}

/**
 * Dedupe authors from books (by `authorId` when set, else normalized `author` name).
 * Names prefer the catalog entry when the id or name matches `authors.json`.
 */
export const getBookAuthorSummariesFromBooks = (
  bookList: { authorId?: string; author: string }[]
): BookAuthorSummary[] => {
  const map = new Map<string, BookAuthorSummary>();
  for (const book of bookList) {
    const id = book.authorId?.trim();
    const key = id
      ? `id:${id}`
      : `name:${book.author.trim().toLowerCase()}`;
    if (map.has(key)) continue;
    const catalog = id
      ? getAuthorById(id)
      : getAuthorByName(book.author);
    const name = catalog?.name ?? book.author;
    map.set(key, { key, name });
  }
  return [...map.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
};

export type GenreMatchKind = 'book-exact' | 'book-fuzzy' | 'author-genre';

function dedupeBooksByIsbn(list: BookWithAuthorId[]): BookWithAuthorId[] {
  const seen = new Set<string>();
  return list.filter(b => {
    if (seen.has(b.isbn)) return false;
    seen.add(b.isbn);
    return true;
  });
}

/**
 * Resolve books for a genre label: exact book tag, fuzzy book tag, then authors
 * tagged with that genre (case-insensitive exact match on author.genres).
 */
export const resolveGenreBooks = (
  genre: string
): { books: BookWithAuthorId[]; match: GenreMatchKind | 'none' } => {
  const g = genre.trim();
  if (!g) return { books: [], match: 'none' };

  const exact = books.filter(book => book.genres.includes(g));
  if (exact.length > 0) {
    return {
      books: dedupeBooksByIsbn(exact as BookWithAuthorId[]),
      match: 'book-exact'
    };
  }

  const lowerG = g.toLowerCase();
  const fuzzy = books.filter(book =>
    book.genres.some(bookGenre => {
      const lb = bookGenre.toLowerCase();
      return lb.includes(lowerG) || lowerG.includes(lb);
    })
  );
  if (fuzzy.length > 0) {
    return {
      books: dedupeBooksByIsbn(fuzzy as BookWithAuthorId[]),
      match: 'book-fuzzy'
    };
  }

  const authorIds = new Set(
    authors
      .filter(a => a.genres.some(ag => ag.toLowerCase() === lowerG))
      .map(a => a.id)
  );
  const byAuthorTag = books.filter(
    b => b.authorId && authorIds.has(b.authorId)
  ) as BookWithAuthorId[];
  if (byAuthorTag.length > 0) {
    return {
      books: dedupeBooksByIsbn(byAuthorTag),
      match: 'author-genre'
    };
  }

  return { books: [], match: 'none' };
};
