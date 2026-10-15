import { useState, useEffect, useCallback, useMemo } from 'react';
import { Book } from '../components/Book';
import { ReadingStatus } from '../types/reading';
import { DEFAULTS } from '../constants';
import {
  backfillReadingActivityByDay,
  buildDefaultReadingActivityByDay,
  localDateKey,
} from '../utils/readingActivityHeatmap';

interface BookWithReadingStatus extends Book {
  status: ReadingStatus | null;
  progress?: number;
  userRating?: number | null;
}

const STORAGE_KEY = 'book-status-data';
/** Bumped when demo shelf counts change so existing browsers pick up new defaults. */
const BOOK_STATUS_SEED_VERSION_KEY = 'polo-book-status-seed-version';
const BOOK_STATUS_SEED_VERSION = 4;
const READING_ACTIVITY_KEY = 'polo-reading-activity-by-day';
/** Bumped when the demo activity window expands (e.g. 26 → 53 weeks). */
const READING_ACTIVITY_VERSION_KEY = 'polo-reading-activity-version';
const READING_ACTIVITY_VERSION = 2;

interface BookStatusData {
  [isbn: string]: {
    status: ReadingStatus | null;
    progress?: number;
    userRating?: number | null;
  };
}

/** Demo shelf for first-time visitors / reset. */
export const DEFAULT_SHELF_COUNTS = {
  'want-to-read': 23,
  'currently-reading': 2,
  finished: 6,
} as const;

function repeatSeed(
  status: ReadingStatus,
  progress: number,
  count: number
): Array<{ status: ReadingStatus; progress: number }> {
  return Array.from({ length: count }, () => ({ status, progress }));
}

export const DEFAULT_STATUS_SEED: Array<{
  status: ReadingStatus;
  progress: number;
}> = [
  ...repeatSeed('want-to-read', 0, DEFAULT_SHELF_COUNTS['want-to-read']),
  { status: 'currently-reading', progress: 34 },
  { status: 'currently-reading', progress: 68 },
  ...repeatSeed('finished', 100, DEFAULT_SHELF_COUNTS.finished),
];

export function buildDefaultReadingStatusData(books: Book[]): BookStatusData {
  const withIsbn = books.filter((book) => Boolean(book.isbn));
  const data: BookStatusData = {};

  DEFAULT_STATUS_SEED.forEach((entry, index) => {
    const book = withIsbn[index];
    if (!book?.isbn) return;
    data[book.isbn] = {
      status: entry.status,
      progress: entry.progress,
    };
  });

  return data;
}

export const useBookStatus = (books: Book[]) => {
  const [readingStatusData, setReadingStatusData] = useState<BookStatusData>({});
  const [activityByDay, setActivityByDay] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Default status constant
  const DEFAULT_STATUS: ReadingStatus | null = DEFAULTS.DEFAULT_BOOK_STATUS;

  // Load statuses from localStorage on mount; seed / refresh demo shelf when needed
  useEffect(() => {
    try {
      const seedVersion = Number(
        localStorage.getItem(BOOK_STATUS_SEED_VERSION_KEY) || '0'
      );
      const stored = localStorage.getItem(STORAGE_KEY);
      let migrated: BookStatusData = {};

      if (stored) {
        const parsed = JSON.parse(stored);
        migrated = Object.entries(parsed || {}).reduce((acc, [isbn, data]) => {
          if (typeof data === 'string') {
            // Old format: just status string
            acc[isbn] = { status: data as ReadingStatus, progress: 0 };
          } else {
            // New format: object with status and progress
            acc[isbn] = data as { status: ReadingStatus; progress?: number };
          }
          return acc;
        }, {} as BookStatusData);
      }

      const needsDemoSeed =
        Object.keys(migrated).length === 0 ||
        seedVersion < BOOK_STATUS_SEED_VERSION;

      setReadingStatusData(
        needsDemoSeed ? buildDefaultReadingStatusData(books) : migrated
      );
      localStorage.setItem(
        BOOK_STATUS_SEED_VERSION_KEY,
        String(BOOK_STATUS_SEED_VERSION)
      );
    } catch (error) {
      console.warn('Failed to load book statuses from localStorage:', error);
      setReadingStatusData(buildDefaultReadingStatusData(books));
    } finally {
      setIsLoading(false);
    }
    // Catalog is static for this app; seed only on first mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      const version = Number(
        localStorage.getItem(READING_ACTIVITY_VERSION_KEY) || '0'
      );
      const raw = localStorage.getItem(READING_ACTIVITY_KEY);
      let stored: Record<string, number> = {};

      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, number>;
        if (parsed && typeof parsed === 'object') {
          stored = parsed;
        }
      }

      const hasStored = Object.keys(stored).length > 0;
      let next: Record<string, number>;

      if (!hasStored) {
        next = buildDefaultReadingActivityByDay();
      } else if (version < READING_ACTIVITY_VERSION) {
        // Expand older short seeds to a full year without clobbering logged days.
        next = backfillReadingActivityByDay(stored);
      } else {
        next = stored;
      }

      setActivityByDay(next);
      localStorage.setItem(READING_ACTIVITY_KEY, JSON.stringify(next));
      localStorage.setItem(
        READING_ACTIVITY_VERSION_KEY,
        String(READING_ACTIVITY_VERSION)
      );
    } catch (error) {
      console.warn('Failed to load reading activity from localStorage:', error);
      setActivityByDay(buildDefaultReadingActivityByDay());
    }
  }, []);

  const bumpReadingActivity = useCallback(() => {
    setActivityByDay((prev) => {
      const key = localDateKey(new Date());
      const next = { ...prev, [key]: (prev[key] || 0) + 1 };
      try {
        localStorage.setItem(READING_ACTIVITY_KEY, JSON.stringify(next));
      } catch (error) {
        console.warn('Failed to persist reading activity:', error);
      }
      return next;
    });
  }, []);

  // Save statuses to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(readingStatusData));
      } catch (error) {
        console.warn('Failed to save book statuses to localStorage:', error);
      }
    }
  }, [readingStatusData, isLoading]);

  // Get books with their current status and progress
  const getBooksWithStatus = useCallback((): BookWithReadingStatus[] => {
    return books.map(book => {
      const storedData = readingStatusData[book.isbn || ''];
      
      // For progress: use stored progress if it exists, otherwise use book's original progress
      let finalProgress = book.progress; // Start with book's original progress
      if (storedData?.progress !== undefined) {
        finalProgress = storedData.progress; // Override only if stored progress exists
      }
      
      // For userRating: use stored rating if it exists, otherwise use book's original rating
      let finalUserRating = book.userRating; // Start with book's original rating
      if (storedData?.userRating !== undefined) {
        finalUserRating = storedData.userRating; // Override only if stored rating exists
      }
      
      // Determine initial status based on book data
      const determineInitialStatus = (): ReadingStatus | null => {
        // If book has progress = 100, it should be marked as finished
        if (book.progress && book.progress === 100) {
          return 'finished';
        }
        // If book has progress > 0, it should be marked as currently reading
        if (book.progress && book.progress > 0) {
          return 'currently-reading';
        }
        // Otherwise, return null (no status assigned yet)
        return null;
      };
      
      return {
        ...book,
        status: storedData?.status ?? determineInitialStatus(),
        progress: finalProgress,
        userRating: finalUserRating,
      };
    });
  }, [books, readingStatusData]);

  // Update a book's status
  const updateBookStatus = useCallback((isbn: string | undefined, status: ReadingStatus | null) => {
    if (!isbn) return; // Skip books without ISBN
    
    console.log('useBookStatus updateBookStatus called:', { isbn, status });
    
    const book = books.find(b => b.isbn === isbn);
    setReadingStatusData(prev => {
      const newData = {
        ...prev,
        [isbn]: {
          status,
          progress: prev[isbn]?.progress ?? book?.progress ?? 0, // Use stored progress, then book progress, then default to 0
          userRating: prev[isbn]?.userRating,
        },
      };
      console.log('useBookStatus setReadingStatusData:', { 
        oldData: prev, 
        newData, 
        isbn, 
        status,
        timestamp: Date.now()
      });
      return newData;
    });
    bumpReadingActivity();
  }, [books, bumpReadingActivity]);

  // Clear a book's status (remove it from localStorage)
  const clearBookStatus = useCallback((isbn: string | undefined) => {
    if (!isbn) return; // Skip books without ISBN
    
    setReadingStatusData(prev => {
      const newData = { ...prev };
      delete newData[isbn];
      return newData;
    });
    bumpReadingActivity();
  }, [bumpReadingActivity]);

  // Update a book's progress
  const updateBookProgress = useCallback((isbn: string | undefined, progress: number) => {
    if (!isbn) return; // Skip books without ISBN
    
    setReadingStatusData(prev => ({
      ...prev,
      [isbn]: {
        status: prev[isbn]?.status || DEFAULT_STATUS,
        progress: Math.max(0, Math.min(100, progress)), // Ensure progress is between 0-100
        userRating: prev[isbn]?.userRating,
      },
    }));
    bumpReadingActivity();
  }, [bumpReadingActivity]);

  // Update a book's user rating without changing its progress
  const updateBookRating = useCallback((isbn: string | undefined, rating: number | null) => {
    if (!isbn) return; // Skip books without ISBN

    const book = books.find(b => b.isbn === isbn);

    setReadingStatusData(prev => ({
      ...prev,
      [isbn]: {
        status: prev[isbn]?.status ?? DEFAULT_STATUS,
        // Preserve existing progress if present; otherwise fall back to the book's original progress.
        progress: prev[isbn]?.progress ?? book?.progress,
        userRating: rating,
      },
    }));
    bumpReadingActivity();
  }, [books, bumpReadingActivity]);

  // Reset all statuses to the demo seed
  const resetStatuses = useCallback(() => {
    setReadingStatusData(buildDefaultReadingStatusData(books));
  }, [books]);

  // Restore demo shelf + reading activity seeds
  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(
        BOOK_STATUS_SEED_VERSION_KEY,
        String(BOOK_STATUS_SEED_VERSION)
      );
      const seededActivity = buildDefaultReadingActivityByDay();
      localStorage.setItem(READING_ACTIVITY_KEY, JSON.stringify(seededActivity));
      localStorage.setItem(
        READING_ACTIVITY_VERSION_KEY,
        String(READING_ACTIVITY_VERSION)
      );
      setReadingStatusData(buildDefaultReadingStatusData(books));
      setActivityByDay(seededActivity);
      console.log('LocalStorage cleared, restored default shelf and activity seeds');
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }, [books]);

  // Memoize booksWithStatus to ensure proper re-renders
  const booksWithStatus = useMemo(() => {
    return getBooksWithStatus();
  }, [readingStatusData]); // Only depend on readingStatusData, not the books array reference

  return {
    booksWithStatus,
    activityByDay,
    updateBookStatus,
    updateBookProgress,
    updateBookRating,
    clearBookStatus,
    resetStatuses,
    clearLocalStorage,
    isLoading,
  };
};
