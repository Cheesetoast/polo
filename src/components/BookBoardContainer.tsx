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
  const { booksWithStatus, updateBookStatus, resetStatuses, isLoading } = useBookStatus(books);

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
      <BookBoard 
        books={booksWithStatus} 
        onBookStatusChange={updateBookStatus}
      />
    </div>
  );
};
