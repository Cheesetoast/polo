import { renderHook, act, waitFor } from '@testing-library/react';
import {
  DEFAULT_SHELF_COUNTS,
  buildDefaultReadingStatusData,
  useBookStatus,
} from '../useBookStatus';
import { Book } from '../../components/Book';
import { localDateKey } from '../../utils/readingActivityHeatmap';
import booksData from '../../data/books.json';

const catalogBooks = booksData as Book[];

const mockBooks: Book[] = [
  {
    title: 'Book 1',
    author: 'Author 1',
    description: { description: 'Description 1' },
    isbn: '978-1',
    communityRating: 4.0,
    genre: 'Fiction',
    pages: 300,
  },
  {
    title: 'Book 2',
    author: 'Author 2',
    description: { description: 'Description 2' },
    isbn: '978-2',
    communityRating: 3.5,
    genre: 'Non-Fiction',
    pages: 250,
  },
  {
    title: 'Book 3',
    author: 'Author 3',
    description: { description: 'Description 3' },
    isbn: '978-3',
    communityRating: 4.5,
    genre: 'Fiction',
    pages: 400,
  },
];

describe('buildDefaultReadingStatusData', () => {
  it('seeds 23 want-to-read, 2 currently-reading, and 6 finished', () => {
    const seed = buildDefaultReadingStatusData(catalogBooks);
    const counts = Object.values(seed).reduce(
      (acc, entry) => {
        if (!entry.status) return acc;
        acc[entry.status] = (acc[entry.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    expect(counts['want-to-read']).toBe(DEFAULT_SHELF_COUNTS['want-to-read']);
    expect(counts['currently-reading']).toBe(
      DEFAULT_SHELF_COUNTS['currently-reading']
    );
    expect(counts.finished).toBe(DEFAULT_SHELF_COUNTS.finished);

    const finishedEntries = Object.values(seed).filter(
      (entry) => entry.status === 'finished'
    );
    expect(finishedEntries.every((entry) => entry.progress === 100)).toBe(true);
  });
});

describe('useBookStatus', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with the demo shelf seed when storage is empty', async () => {
    const { result } = renderHook(() => useBookStatus(catalogBooks));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const byStatus = result.current.booksWithStatus.reduce(
      (acc, book) => {
        if (!book.status) return acc;
        acc[book.status] = (acc[book.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    expect(byStatus['want-to-read']).toBe(DEFAULT_SHELF_COUNTS['want-to-read']);
    expect(byStatus['currently-reading']).toBe(
      DEFAULT_SHELF_COUNTS['currently-reading']
    );
    expect(byStatus.finished).toBe(DEFAULT_SHELF_COUNTS.finished);
  });

  it('updates book status when updateBookStatus is called', async () => {
    const { result } = renderHook(() => useBookStatus(mockBooks));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.updateBookStatus('978-1', 'finished');
    });

    const updatedBook = result.current.booksWithStatus.find(
      (book) => book.isbn === '978-1'
    );
    expect(updatedBook?.status).toBe('finished');
  });

  it('updates book progress when updateBookProgress is called', async () => {
    const { result } = renderHook(() => useBookStatus(mockBooks));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.updateBookProgress('978-1', 75);
    });

    const updatedBook = result.current.booksWithStatus.find(
      (book) => book.isbn === '978-1'
    );
    expect(updatedBook?.progress).toBe(75);
  });

  it('resets statuses back to the demo seed', async () => {
    const { result } = renderHook(() => useBookStatus(catalogBooks));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const firstIsbn = catalogBooks[0].isbn;
    act(() => {
      result.current.updateBookStatus(firstIsbn, 'finished');
    });

    act(() => {
      result.current.resetStatuses();
    });

    const book1 = result.current.booksWithStatus.find(
      (book) => book.isbn === firstIsbn
    );
    expect(book1?.status).toBe('want-to-read');
  });

  it('loads statuses from localStorage on mount', async () => {
    const storedData = {
      '978-1': { status: 'finished', progress: 25 },
    };
    localStorage.setItem('book-status-data', JSON.stringify(storedData));
    localStorage.setItem('polo-book-status-seed-version', '4');

    const { result } = renderHook(() => useBookStatus(mockBooks));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const book1 = result.current.booksWithStatus.find(
      (book) => book.isbn === '978-1'
    );
    expect(book1?.status).toBe('finished');
    expect(book1?.progress).toBe(25);
  });

  it('saves statuses to localStorage when updated', async () => {
    const { result } = renderHook(() => useBookStatus(mockBooks));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.updateBookStatus('978-1', 'finished');
    });

    const storedData = JSON.parse(
      localStorage.getItem('book-status-data') || '{}'
    );
    expect(storedData['978-1'].status).toBe('finished');
  });

  it('records reading activity when status updates', async () => {
    const { result } = renderHook(() => useBookStatus(mockBooks));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const key = localDateKey(new Date());

    act(() => {
      result.current.updateBookStatus('978-1', 'currently-reading');
    });

    const activity = JSON.parse(
      localStorage.getItem('polo-reading-activity-by-day') || '{}'
    );
    expect(activity[key]).toBeGreaterThanOrEqual(1);
    expect(result.current.activityByDay[key]).toBeGreaterThanOrEqual(1);
  });

  it('handles books without ISBN gracefully', async () => {
    const booksWithoutISBN = [
      {
        title: 'Book X',
        author: 'Author X',
        description: { description: 'Description X' },
        isbn: '',
        communityRating: 4.0,
        genre: 'Fiction',
      },
    ];

    const { result } = renderHook(() => useBookStatus(booksWithoutISBN));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.booksWithStatus).toHaveLength(1);
    expect(result.current.booksWithStatus[0].status).toBe(null);
  });

  it('restores the demo seed when clearLocalStorage is called', async () => {
    const { result } = renderHook(() => useBookStatus(catalogBooks));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const firstIsbn = catalogBooks[0].isbn;
    act(() => {
      result.current.updateBookStatus(firstIsbn, 'finished');
    });

    act(() => {
      result.current.clearLocalStorage();
    });

    await waitFor(() => {
      const book1 = result.current.booksWithStatus.find(
        (book) => book.isbn === firstIsbn
      );
      expect(book1?.status).toBe('want-to-read');
    });
    const activity = JSON.parse(
      localStorage.getItem('polo-reading-activity-by-day') || '{}'
    );
    expect(Object.keys(activity).length).toBeGreaterThan(0);
  });
});
