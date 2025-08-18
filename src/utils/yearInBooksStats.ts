import { Book } from '../components/Book';

export interface YearInBooksStats {
  booksRead: number;
  pagesRead: number;
  averageRating: number;
  topBooks: Book[];
  favoriteGenre: string;
}

export const calculateYearInBooksStats = (books: Book[], year: number = new Date().getFullYear()): YearInBooksStats => {
  // Filter books finished in the specified year
  const booksFinishedThisYear = books.filter(book => {
    if (!book.dateFinished) return false;
    const finishDate = new Date(book.dateFinished);
    return finishDate.getFullYear() === year;
  });

  // Calculate books read
  const booksRead = booksFinishedThisYear.length;

  // Calculate pages read
  const pagesRead = booksFinishedThisYear.reduce((total, book) => {
    return total + (book.pages || 0);
  }, 0);

  // Calculate average rating (use user rating if available, otherwise community rating)
  const booksWithRatings = booksFinishedThisYear.filter(book => book.userRating !== undefined || book.communityRating !== undefined);
  const averageRating = booksWithRatings.length > 0
    ? booksWithRatings.reduce((sum, book) => {
        // Prefer user rating if available, otherwise use community rating
        const rating = book.userRating !== undefined ? book.userRating : (book.communityRating || 0);
        return sum + rating;
      }, 0) / booksWithRatings.length
    : 0;

  // Get top books (sorted by user rating if available, then community rating, then by pages)
  const topBooks = [...booksFinishedThisYear]
    .sort((a, b) => {
      // Get the primary rating for comparison (user rating preferred, fallback to community)
      const getPrimaryRating = (book: Book) => {
        return book.userRating !== undefined ? book.userRating : (book.communityRating || 0);
      };
      
      const ratingDiff = getPrimaryRating(b) - getPrimaryRating(a);
      if (ratingDiff !== 0) return ratingDiff;
      // Tiebreak by pages
      return (b.pages || 0) - (a.pages || 0);
    })
    .slice(0, 5);

  // Calculate favorite genre
  const genreCounts: Record<string, number> = {};
  booksFinishedThisYear.forEach(book => {
    if (book.genre) {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    }
  });
  
  const favoriteGenre = Object.keys(genreCounts).length > 0
    ? Object.entries(genreCounts).sort(([,a], [,b]) => b - a)[0][0]
    : 'None';

  return {
    booksRead,
    pagesRead,
    averageRating,
    topBooks,
    favoriteGenre
  };
};
