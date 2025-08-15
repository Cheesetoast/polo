import { useState, useEffect, useCallback } from 'react';
import { Book } from '../components/Book';
import { BookWithReadingStatus, ReadingStatus } from '../components/BookBoard';
import { DEFAULTS } from '../constants';

const STORAGE_KEY = 'book-status-data';

interface BookStatusData {
  [isbn: string]: ReadingStatus;
}

export const useBookStatus = (books: Book[]) => {
  const [readingStatusData, setReadingStatusData] = useState<BookStatusData>({});
  const [isLoading, setIsLoading] = useState(true);

  // Default status constant
  const DEFAULT_STATUS: ReadingStatus = DEFAULTS.DEFAULT_BOOK_STATUS;

  // Load statuses from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setReadingStatusData(parsed);
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

  // Get books with their current status
  const getBooksWithStatus = useCallback((): BookWithReadingStatus[] => {
    return books.map(book => ({
      ...book,
      status: readingStatusData[book.isbn || ''] || DEFAULT_STATUS,
    }));
  }, [books, readingStatusData]);

  // Update a book's status
  const updateBookStatus = useCallback((isbn: string | undefined, status: ReadingStatus) => {
    if (!isbn) return; // Skip books without ISBN
    
    setReadingStatusData(prev => ({
      ...prev,
      [isbn]: status,
    }));
  }, []);

  // Reset all statuses to default
  const resetStatuses = useCallback(() => {
    setReadingStatusData({});
  }, []);

  return {
    booksWithStatus: getBooksWithStatus(),
    updateBookStatus,
    resetStatuses,
    isLoading,
  };
};
