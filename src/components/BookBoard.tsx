import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Book } from './Book';
import { ReadingStatus } from '../types/reading';
import books from '../data/books.json';

// Temporarily simplified BookBoard without @dnd-kit to fix build issues
export const BookBoard = () => {
  const [bookStatuses, setBookStatuses] = useState<Record<string, ReadingStatus>>(() => {
    const statuses: Record<string, ReadingStatus> = {};
    books.forEach(book => {
      if (book.progress === 0) statuses[book.isbn] = 'not-started';
      else if (book.progress === 100) statuses[book.isbn] = 'finished';
      else statuses[book.isbn] = 'in-progress';
    });
    return statuses;
  });

  const handleBookClick = (isbn: string) => {
    const currentStatus = bookStatuses[isbn];
    const statusOrder: ReadingStatus[] = ['not-started', 'in-progress', 'finished'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const newStatus = statusOrder[nextIndex];
    
    setBookStatuses(prev => ({
      ...prev,
      [isbn]: newStatus
    }));
  };

  const getBooksByStatus = (status: ReadingStatus) => {
    return books.filter(book => bookStatuses[book.isbn] === status);
  };

  const columns: { status: ReadingStatus; title: string; color: string }[] = [
    { status: 'not-started', title: 'Not Started', color: '#e74c3c' },
    { status: 'in-progress', title: 'In Progress', color: '#f39c12' },
    { status: 'finished', title: 'Finished', color: '#27ae60' }
  ];

  return (
    <BoardContainer>
      <BoardTitle>My Reading Board</BoardTitle>
      <ColumnsContainer>
        {columns.map(({ status, title, color }) => (
          <Column key={status}>
            <ColumnHeader backgroundColor={color}>
              <ColumnTitle>{title}</ColumnTitle>
              <BookCount>{getBooksByStatus(status).length}</BookCount>
            </ColumnHeader>
            <ColumnContent>
              {getBooksByStatus(status).map(book => (
                <Book
                  key={book.isbn}
                  book={{ ...book, status }}
                  onClick={() => handleBookClick(book.isbn)}
                  showStatus={false}
                />
              ))}
            </ColumnContent>
          </Column>
        ))}
      </ColumnsContainer>
    </BoardContainer>
  );
};

export default BookBoard;

// Styled Components
const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  min-height: 400px;
`;

const BoardTitle = styled.h2`
  text-align: center;
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
`;

const ColumnsContainer = styled.div`
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

const ColumnHeader = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'backgroundColor',
})<{ backgroundColor?: string }>`
  background: ${props => props.backgroundColor || theme.colors.primary};
  color: white;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
  font-weight: ${theme.fontWeights.semibold};
  font-size: ${theme.fontSizes.lg};
`;

const ColumnTitle = styled.h3`
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.bold};
  color: white;
  margin-bottom: ${theme.spacing.sm};
`;

const BookCount = styled.div`
  font-size: ${theme.fontSizes.sm};
  opacity: 0.8;
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
