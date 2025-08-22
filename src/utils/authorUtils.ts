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
  notableWorks: string[];
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
  genre: string;
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
