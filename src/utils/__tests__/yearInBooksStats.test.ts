import { calculateYearInBooksStats } from '../yearInBooksStats';
import { Book } from '../../components/Book';

const mockBooks: Book[] = [
  {
    title: 'Book 1',
    author: 'Author 1',
    description: { description: 'Description 1' },
    isbn: '978-1',
    communityRating: 4.0,
    userRating: 5,
    genre: 'Fiction',
    pages: 300,
    dateFinished: '2023-03-15',
    type: 'paper'
  },
  {
    title: 'Book 2',
    author: 'Author 2',
    description: { description: 'Description 2' },
    isbn: '978-2',
    communityRating: 3.5,
    userRating: 4,
    genre: 'Non-Fiction',
    pages: 250,
    dateFinished: '2023-05-20',
    type: 'digital'
  },
  {
    title: 'Book 3',
    author: 'Author 3',
    description: { description: 'Description 3' },
    isbn: '978-3',
    communityRating: 4.5,
    genre: 'Fiction',
    pages: 400,
    dateFinished: '2022-12-31', // Different year
    type: 'audio'
  },
  {
    title: 'Book 4',
    author: 'Author 4',
    description: { description: 'Description 4' },
    isbn: '978-4',
    communityRating: 3.8,
    genre: 'Fiction',
    pages: 200,
    // No dateFinished - not finished
    type: 'paper'
  }
];

describe('calculateYearInBooksStats', () => {
  it('calculates correct stats for 2023', () => {
    const stats = calculateYearInBooksStats(mockBooks, 2023);
    
    expect(stats.booksRead).toBe(2);
    expect(stats.pagesRead).toBe(550); // 300 + 250
    expect(stats.averageRating).toBe(4.5); // (5 + 4) / 2
    expect(stats.topBooks).toHaveLength(2);
    expect(stats.favoriteGenre).toBe('Fiction');
  });

  it('calculates correct stats for 2022', () => {
    const stats = calculateYearInBooksStats(mockBooks, 2022);
    
    expect(stats.booksRead).toBe(1);
    expect(stats.pagesRead).toBe(400);
    expect(stats.averageRating).toBe(4.5);
    expect(stats.topBooks).toHaveLength(1);
    expect(stats.favoriteGenre).toBe('Fiction');
  });

  it('returns empty stats for year with no finished books', () => {
    const stats = calculateYearInBooksStats(mockBooks, 2024);
    
    expect(stats.booksRead).toBe(0);
    expect(stats.pagesRead).toBe(0);
    expect(stats.averageRating).toBe(0);
    expect(stats.topBooks).toHaveLength(0);
    expect(stats.favoriteGenre).toBe('None');
  });

  it('sorts top books by user rating first, then community rating', () => {
    const stats = calculateYearInBooksStats(mockBooks, 2023);
    
    expect(stats.topBooks[0].title).toBe('Book 1'); // userRating: 5
    expect(stats.topBooks[1].title).toBe('Book 2'); // userRating: 4
  });

  it('uses community rating when user rating is not available', () => {
    const booksWithOnlyCommunityRating = [
      {
        title: 'Book A',
        author: 'Author A',
        description: { description: 'Description A' },
        isbn: '978-A',
        communityRating: 4.5,
        genre: 'Fiction',
        pages: 300,
        dateFinished: '2023-06-15',
        type: 'paper'
      },
      {
        title: 'Book B',
        author: 'Author B',
        description: { description: 'Description B' },
        isbn: '978-B',
        communityRating: 3.8,
        genre: 'Non-Fiction',
        pages: 250,
        dateFinished: '2023-07-20',
        type: 'digital'
      }
    ];
    
    const stats = calculateYearInBooksStats(booksWithOnlyCommunityRating, 2023);
    
    expect(stats.averageRating).toBe(4.15); // (4.5 + 3.8) / 2
    expect(stats.topBooks[0].title).toBe('Book A'); // Higher community rating
  });

  it('handles books with no ratings', () => {
    const booksWithoutRatings = [
      {
        title: 'Book X',
        author: 'Author X',
        description: { description: 'Description X' },
        isbn: '978-X',
        genre: 'Fiction',
        pages: 300,
        dateFinished: '2023-06-15', // Use a date in the middle of the year
        type: 'paper'
      }
    ];
    
    const stats = calculateYearInBooksStats(booksWithoutRatings, 2023);
    
    expect(stats.booksRead).toBe(1);
    expect(stats.pagesRead).toBe(300);
    expect(stats.averageRating).toBe(0);
    expect(stats.favoriteGenre).toBe('Fiction');
  });

  it('uses current year as default', () => {
    const currentYear = new Date().getFullYear();
    const stats = calculateYearInBooksStats(mockBooks);
    
    // Should return stats for current year (likely 0 books for 2024)
    expect(stats.booksRead).toBe(0);
  });
});
