import React from 'react';
import { BookBoard } from './BookBoard';
import { useBookStatus } from '../hooks/useBookStatus';
import { Book } from './Book';
import { Button } from './Button';
import { Text } from './Text';
import { theme } from '../styles/theme';

interface BookBoardContainerProps {
  books: Book[];
  title?: string;
  showResetButton?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const BookBoardContainer: React.FC<BookBoardContainerProps> = ({
  books,
  title = 'My Reading List',
  showResetButton = true,
  className,
  style,
}) => {
  const { booksWithStatus, updateBookStatus, updateBookProgress, resetStatuses, clearLocalStorage, isLoading } = useBookStatus(books);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalBooks = booksWithStatus.length;
    const finishedBooks = booksWithStatus.filter(book => book.status === 'finished').length;
    const currentlyReading = booksWithStatus.filter(book => book.status === 'currently-reading').length;
    const wantToRead = booksWithStatus.filter(book => book.status === 'want-to-read').length;
    
    // Genre distribution
    const genreCounts = booksWithStatus.reduce((acc, book) => {
      if (book.genre) {
        acc[book.genre] = (acc[book.genre] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const topGenres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre, count]) => `${genre} (${count})`);
    
    // Average rating
    const ratedBooks = booksWithStatus.filter(book => book.rating);
    const averageRating = ratedBooks.length > 0 
      ? (ratedBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / ratedBooks.length).toFixed(1)
      : 'N/A';
    
    // Book type distribution
    const typeCounts = booksWithStatus.reduce((acc, book) => {
      if (book.type) {
        acc[book.type] = (acc[book.type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalBooks,
      finishedBooks,
      currentlyReading,
      wantToRead,
      topGenres,
      averageRating,
      typeCounts
    };
  }, [booksWithStatus]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={className} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
        <Text variant="h2">{title}</Text>
        {showResetButton && (
          <Button onClick={resetStatuses} variant="outline" size="small">
            Reset All
          </Button>
        )}
      </div>
      
      {/* Statistics Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: theme.spacing.md, 
        marginBottom: theme.spacing.lg,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.muted + '20',
        borderRadius: theme.borderRadius.md
      }}>
        <div style={{ textAlign: 'center' }}>
          <Text variant="h3" style={{ color: theme.colors.primary, marginBottom: theme.spacing.xs }}>
            {stats.totalBooks}
          </Text>
          <Text variant="caption">Total Books</Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Text variant="h3" style={{ color: theme.colors.success, marginBottom: theme.spacing.xs }}>
            {stats.finishedBooks}
          </Text>
          <Text variant="caption">Finished</Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Text variant="h3" style={{ color: theme.colors.warning, marginBottom: theme.spacing.xs }}>
            {stats.currentlyReading}
          </Text>
          <Text variant="caption">Currently Reading</Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Text variant="h3" style={{ color: theme.colors.blue?.[500] || '#3b82f6', marginBottom: theme.spacing.xs }}>
            {stats.wantToRead}
          </Text>
          <Text variant="caption">Want to Read</Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Text variant="h3" style={{ color: theme.colors.secondary, marginBottom: theme.spacing.xs }}>
            {stats.averageRating}
          </Text>
          <Text variant="caption">Avg Rating</Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Text variant="h3" style={{ color: theme.colors.primary, marginBottom: theme.spacing.xs }}>
            {stats.topGenres[0]?.split(' (')[0] || 'N/A'}
          </Text>
          <Text variant="caption">Top Genre</Text>
        </div>
      </div>
      
      <BookBoard 
        books={booksWithStatus} 
        onBookStatusChange={updateBookStatus}
      />
    </div>
  );
};
