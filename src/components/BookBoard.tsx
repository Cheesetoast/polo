import React, { useState } from 'react';
import styled from 'styled-components';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { theme } from '../styles/theme';
import { Book } from './Book';
import { ReadingStatus } from '../types/reading';
import books from '../data/books.json';
import { useBookStatus } from '../hooks/useBookStatus';

export const BookBoard = () => {
  const { booksWithStatus, updateBookStatus } = useBookStatus(books);
  const [activeBook, setActiveBook] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleBookClick = (isbn: string) => {
    const currentBook = booksWithStatus.find(book => book.isbn === isbn);
    const currentStatus = currentBook?.status;
    const statusOrder: ReadingStatus[] = ['want-to-read', 'currently-reading', 'finished'];
    const currentIndex = statusOrder.indexOf(currentStatus as ReadingStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const newStatus = statusOrder[nextIndex];
    
    updateBookStatus(isbn, newStatus);
  };

  const getBooksByStatus = (status: ReadingStatus) => {
    return booksWithStatus.filter(book => book.status === status);
  };

  const getTotalAssignedBooks = () => {
    return booksWithStatus.filter(book => book.status !== null).length;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const book = books.find(b => b.isbn === active.id);
    setActiveBook(book);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const bookId = active.id as string;
      const newStatus = over.id as ReadingStatus;
      
      updateBookStatus(bookId, newStatus);
    }
    
    setActiveBook(null);
  };

  const columns: { status: ReadingStatus; title: string; color: string }[] = [
    { status: 'want-to-read', title: 'Want to Read', color: '#e74c3c' },
    { status: 'currently-reading', title: 'Currently Reading', color: '#f39c12' },
    { status: 'finished', title: 'Finished', color: '#27ae60' }
  ];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <BoardContainer>
        <BoardTitle>
          My Reading Board
          {getTotalAssignedBooks() > 0 && (
            <BoardSubtitle>{getTotalAssignedBooks()} book{getTotalAssignedBooks() !== 1 ? 's' : ''} organized</BoardSubtitle>
          )}
        </BoardTitle>
        
        {getTotalAssignedBooks() === 0 ? (
          <EmptyState>
            <div>
              <h3>No books organized yet</h3>
              <p>Start by assigning a status to a book from the book detail page</p>
            </div>
          </EmptyState>
        ) : (
          <ColumnsContainer>
          {columns.map(({ status, title, color }) => (
            <Column key={status}>
              <ColumnHeader backgroundColor={color}>
                <ColumnTitle>{title}</ColumnTitle>
                <BookCount>{getBooksByStatus(status).length}</BookCount>
              </ColumnHeader>
              <DroppableColumn id={status}>
                <SortableContext
                  items={getBooksByStatus(status).map(book => book.isbn)}
                  strategy={verticalListSortingStrategy}
                >
                  {getBooksByStatus(status).map(book => (
                    <Book
                      key={book.isbn}
                      book={{ ...book, status }}
                      onClick={() => handleBookClick(book.isbn)}
                      showStatus={false}

                    />
                  ))}
                </SortableContext>
              </DroppableColumn>
            </Column>
          ))}
        </ColumnsContainer>
        )}
      </BoardContainer>
      
      <DragOverlay>
        {activeBook ? (
          <Book
            book={{ ...activeBook, status: booksWithStatus.find(b => b.isbn === activeBook.isbn)?.status || null }}
            onClick={() => {}}
            showStatus={false}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
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

const BoardSubtitle = styled.div`
  text-align: center;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.normal};
  color: ${theme.colors.secondary};
  margin-top: ${theme.spacing.xs};
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

const DroppableColumn = ({ id, children }: { id: ReadingStatus; children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <ColumnContent ref={setNodeRef}>
      {children}
    </ColumnContent>
  );
};

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
