import { useState, useEffect, useCallback } from 'react';
import { Book } from '../components/Book';
import { ReadingStatus } from '../types/reading';
import { DEFAULTS } from '../constants';

interface BookWithReadingStatus extends Book {
  status: ReadingStatus | null;
  progress?: number;
}

const STORAGE_KEY = 'book-status-data';

interface BookStatusData {
  [isbn: string]: {
    status: ReadingStatus | null;
    progress?: number;
  };
}

export const useBookStatus = (books: Book[]) => {
  const [readingStatusData, setReadingStatusData] = useState<BookStatusData>({});
  const [isLoading, setIsLoading] = useState(true);

  // Default status constant
  const DEFAULT_STATUS: ReadingStatus | null = DEFAULTS.DEFAULT_BOOK_STATUS;

  // Load statuses from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate old format to new format
        const migrated = Object.entries(parsed).reduce((acc, [isbn, data]) => {
          if (typeof data === 'string') {
            // Old format: just status string
            acc[isbn] = { status: data as ReadingStatus, progress: 0 };
          } else {
            // New format: object with status and progress
            acc[isbn] = data as { status: ReadingStatus; progress?: number };
          }
          return acc;
        }, {} as BookStatusData);
        setReadingStatusData(migrated);
      }
    } catch (error) {
      console.warn('Failed to load book statuses from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
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
      };
    });
  }, [books, readingStatusData]);

  // Update a book's status
  const updateBookStatus = useCallback((isbn: string | undefined, status: ReadingStatus | null) => {
    if (!isbn) return; // Skip books without ISBN
    
    const book = books.find(b => b.isbn === isbn);
    setReadingStatusData(prev => ({
      ...prev,
      [isbn]: {
        status,
        progress: prev[isbn]?.progress ?? book?.progress ?? 0, // Use stored progress, then book progress, then default to 0
      },
    }));
  }, [books]);

  // Clear a book's status (remove it from localStorage)
  const clearBookStatus = useCallback((isbn: string | undefined) => {
    if (!isbn) return; // Skip books without ISBN
    
    setReadingStatusData(prev => {
      const newData = { ...prev };
      delete newData[isbn];
      return newData;
    });
  }, []);

  // Update a book's progress
  const updateBookProgress = useCallback((isbn: string | undefined, progress: number) => {
    if (!isbn) return; // Skip books without ISBN
    
    setReadingStatusData(prev => ({
      ...prev,
      [isbn]: {
        status: prev[isbn]?.status || DEFAULT_STATUS,
        progress: Math.max(0, Math.min(100, progress)), // Ensure progress is between 0-100
      },
    }));
  }, []);

  // Reset all statuses to default
  const resetStatuses = useCallback(() => {
    setReadingStatusData({});
  }, []);

  // Clear localStorage and reset to use original JSON data
  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setReadingStatusData({});
      console.log('LocalStorage cleared, using original JSON data');
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }, []);

  return {
    booksWithStatus: getBooksWithStatus(),
    updateBookStatus,
    updateBookProgress,
    clearBookStatus,
    resetStatuses,
    clearLocalStorage,
    isLoading,
  };
};
