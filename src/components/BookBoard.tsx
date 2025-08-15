import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Book } from './Book';

// Define the status type separately for reuse
export type ReadingStatus = 'want-to-read' | 'currently-reading' | 'finished';

export interface BookWithReadingStatus extends Book {
  status: ReadingStatus;
}

export interface BookBoardProps {
  books: BookWithReadingStatus[];
  onBookStatusChange?: (isbn: string, status: ReadingStatus) => void;
  className?: string;
  style?: React.CSSProperties;
}

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.md};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  min-height: 400px;
`;

const ColumnHeader = styled.div`
  background: ${theme.colors.primary};
  color: white;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
  font-weight: ${theme.fontWeights.semibold};
  font-size: ${theme.fontSizes.lg};
`;

const ColumnContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  flex: 1;
  padding: ${theme.spacing.sm};
  background: ${theme.colors.muted}20;
  border-radius: ${theme.borderRadius.md};
  border: 2px dashed ${theme.colors.muted}40;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${theme.colors.muted};
  font-style: italic;
  text-align: center;
`;

const defaultColumns = [
  {
    id: 'want-to-read',
    title: 'Want to Read',
    color: theme.colors.blue?.[500] || '#3b82f6',
  },
  {
    id: 'currently-reading',
    title: 'Currently Reading',
    color: theme.colors.warning || '#f59e0b',
  },
  {
    id: 'finished',
    title: 'Finished',
    color: theme.colors.success || '#10b981',
  },
] as const;

export const BookBoard: React.FC<BookBoardProps> = ({ books, onBookStatusChange, className, style }) => {
  const getBooksByStatus = (status: ReadingStatus) => {
    return books.filter(book => book.status === status);
  };

  const handleBookClick = (book: BookWithReadingStatus) => {
    if (!onBookStatusChange || !book.isbn) return; // Skip books without ISBN
    
    // Cycle through statuses: want-to-read -> currently-reading -> finished -> want-to-read
    const statusOrder: ReadingStatus[] = ['want-to-read', 'currently-reading', 'finished'];
    const currentIndex = statusOrder.indexOf(book.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const nextStatus = statusOrder[nextIndex];
    
    onBookStatusChange(book.isbn, nextStatus);
  };

  return (
    <BoardContainer className={className} style={style}>
      {defaultColumns.map(column => {
        const columnBooks = getBooksByStatus(column.id);
        
        return (
          <Column key={column.id}>
            <ColumnHeader style={{ backgroundColor: column.color }}>
              {column.title}
              <div style={{ fontSize: theme.fontSizes.sm, opacity: 0.8 }}>
                {columnBooks.length} book{columnBooks.length !== 1 ? 's' : ''}
              </div>
            </ColumnHeader>
            <ColumnContent>
              {columnBooks.length > 0 ? (
                columnBooks.map((book, index) => (
                  <Book 
                    key={`${book.isbn || book.title}-${index}`} 
                    book={book}
                    onClick={() => handleBookClick(book)}
                    style={{ cursor: onBookStatusChange && book.isbn ? 'pointer' : 'default' }}
                    showStatus={true}
                  />
                ))
              ) : (
                <EmptyState>
                  No books in this column yet
                </EmptyState>
              )}
            </ColumnContent>
          </Column>
        );
      })}
    </BoardContainer>
  );
};
