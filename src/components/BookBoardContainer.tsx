import { useMemo } from 'react';
import styled from 'styled-components';
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
  style?: Record<string, any>; // Generic CSS properties
}

export const BookBoardContainer = ({
  books,
  title = 'My Reading List',
  showResetButton = true,
  className,
  style,
}: BookBoardContainerProps) => {
  const { booksWithStatus, updateBookStatus, updateBookProgress, resetStatuses, clearLocalStorage, isLoading } = useBookStatus(books);

  // Calculate statistics
  const stats = useMemo(() => {
    const booksWithAssignedStatus = booksWithStatus.filter(book => book.status !== null);
    const totalBooks = booksWithAssignedStatus.length;
    const finishedBooks = booksWithAssignedStatus.filter(book => book.status === 'finished').length;
    const currentlyReading = booksWithAssignedStatus.filter(book => book.status === 'currently-reading').length;
    const wantToRead = booksWithAssignedStatus.filter(book => book.status === 'want-to-read').length;
    
    // Genre distribution
    const genreCounts = booksWithAssignedStatus.reduce((acc, book) => {
      if (book.genres && book.genres.length > 0) {
        book.genres.forEach(genre => {
          acc[genre] = (acc[genre] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);
    
    const topGenres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre, count]) => `${genre} (${count})`);
    
    // Average rating (use user rating if available, otherwise community rating)
    const ratedBooks = booksWithAssignedStatus.filter(book => book.userRating !== undefined || book.communityRating !== undefined);
    const averageRating = ratedBooks.length > 0 
      ? (ratedBooks.reduce((sum, book) => {
                  // Prefer user rating if available, otherwise use community rating
        const rating = book.userRating !== undefined ? book.userRating : (book.communityRating || 0);
        return sum + (rating || 0);
        }, 0) / ratedBooks.length).toFixed(1)
      : 'N/A';
    
    return {
      totalBooks,
      finishedBooks,
      currentlyReading,
      wantToRead,
      topGenres,
      averageRating
    };
  }, [booksWithStatus]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className={className} style={style}>
      <Header>
        <Text variant="h2">{title}</Text>
        {showResetButton && (
          <Button onClick={resetStatuses} variant="outline" size="small">
            Reset All
          </Button>
        )}
      </Header>
      
      <BookBoard />
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;
