import { renderHook, act } from '@testing-library/react';
import { useBookStatus } from '../useBookStatus';
import { Book } from '../../components/Book';

const mockBooks: Book[] = [
  {
    title: 'Book 1',
    author: 'Author 1',
    description: { description: 'Description 1' },
    isbn: '978-1',
    communityRating: 4.0,
    genre: 'Fiction',
    pages: 300,
    dateFinished: '2023-03-15',

  },
  {
    title: 'Book 2',
    author: 'Author 2',
    description: { description: 'Description 2' },
    isbn: '978-2',
    communityRating: 3.5,
    genre: 'Non-Fiction',
    pages: 250,
    progress: 50,

  },
  {
    title: 'Book 3',
    author: 'Author 3',
    description: { description: 'Description 3' },
    isbn: '978-3',
    communityRating: 4.5,
    genre: 'Fiction',
    pages: 400,

  }
];

describe('useBookStatus', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('initializes books with correct default statuses', () => {
    const { result } = renderHook(() => useBookStatus(mockBooks));
    
    expect(result.current.booksWithStatus).toHaveLength(3);
    
    // Book 1 should be 'finished' (has dateFinished)
    expect(result.current.booksWithStatus[0].status).toBe('finished');
    
    // Book 2 should be 'currently-reading' (has progress > 0)
    expect(result.current.booksWithStatus[1].status).toBe('currently-reading');
    
    // Book 3 should be null (default)
    expect(result.current.booksWithStatus[2].status).toBe(null);
  });

  it('updates book status when updateBookStatus is called', () => {
    const { result } = renderHook(() => useBookStatus(mockBooks));
    
    act(() => {
      result.current.updateBookStatus('978-1', 'currently-reading');
    });
    
    const updatedBook = result.current.booksWithStatus.find(book => book.isbn === '978-1');
    expect(updatedBook?.status).toBe('currently-reading');
  });

  it('updates book progress when updateBookProgress is called', () => {
    const { result } = renderHook(() => useBookStatus(mockBooks));
    
    act(() => {
      result.current.updateBookProgress('978-1', 75);
    });
    
    const updatedBook = result.current.booksWithStatus.find(book => book.isbn === '978-1');
    expect(updatedBook?.progress).toBe(75);
  });

  it('resets all statuses when resetStatuses is called', () => {
    const { result } = renderHook(() => useBookStatus(mockBooks));
    
    // First, update a book status
    act(() => {
      result.current.updateBookStatus('978-1', 'currently-reading');
    });
    
    // Then reset
    act(() => {
      result.current.resetStatuses();
    });
    
    // Should return to default statuses
    const book1 = result.current.booksWithStatus.find(book => book.isbn === '978-1');
    expect(book1?.status).toBe('finished'); // Back to default based on dateFinished
  });

  it('loads statuses from localStorage on mount', () => {
    // Set up localStorage with some data
    const storedData = {
      '978-1': { status: 'currently-reading', progress: 25 }
    };
    localStorage.setItem('book-status-data', JSON.stringify(storedData));
    
    const { result } = renderHook(() => useBookStatus(mockBooks));
    
    const book1 = result.current.booksWithStatus.find(book => book.isbn === '978-1');
    expect(book1?.status).toBe('currently-reading');
    expect(book1?.progress).toBe(25);
  });

  it('saves statuses to localStorage when updated', () => {
    const { result } = renderHook(() => useBookStatus(mockBooks));
    
    act(() => {
      result.current.updateBookStatus('978-1', 'currently-reading');
    });
    
    const storedData = JSON.parse(localStorage.getItem('book-status-data') || '{}');
    expect(storedData['978-1'].status).toBe('currently-reading');
  });

  it('handles books without ISBN gracefully', () => {
    const booksWithoutISBN = [
      {
        title: 'Book X',
        author: 'Author X',
        description: { description: 'Description X' },
        isbn: '', // Empty ISBN
        communityRating: 4.0,
        genre: 'Fiction',
    
      }
    ];
    
    const { result } = renderHook(() => useBookStatus(booksWithoutISBN));
    
    // Should not crash and should assign default status
    expect(result.current.booksWithStatus).toHaveLength(1);
    expect(result.current.booksWithStatus[0].status).toBe(null);
  });

  it('clears localStorage when clearLocalStorage is called', () => {
    const { result } = renderHook(() => useBookStatus(mockBooks));
    
    // First, update a book status to create localStorage data
    act(() => {
      result.current.updateBookStatus('978-1', 'currently-reading');
    });
    
    // Then clear localStorage
    act(() => {
      result.current.clearLocalStorage();
    });
    
    // localStorage should be empty or contain empty object
    const storedData = localStorage.getItem('book-status-data');
    expect(storedData).toBe('{}');
  });
});
