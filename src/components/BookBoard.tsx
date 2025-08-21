import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Book } from './Book';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Define the status type separately for reuse
export type ReadingStatus = 'want-to-read' | 'currently-reading' | 'finished' | null;

export interface BookWithReadingStatus extends Book {
  status: ReadingStatus;
  // Progress is inherited from Book interface (optional)
}

export interface BookBoardProps {
  books: BookWithReadingStatus[];
  onBookStatusChange?: (isbn: string, status: ReadingStatus) => void;
  className?: string;
  style?: Record<string, any>; // Generic CSS properties
}

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

// SortableBook component that wraps the Book component with drag and drop functionality
const SortableBook = ({ book, showStatus }: { book: BookWithReadingStatus; showStatus: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: book.isbn });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Book
        book={book}
        showStatus={showStatus}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
};

// DroppableColumn component that makes a column a drop target
const DroppableColumn = ({ 
  children, 
  status, 
  columnBooks, 
  column 
}: { 
  children: React.ReactNode; 
  status: ReadingStatus; 
  columnBooks: BookWithReadingStatus[];
  column: typeof defaultColumns[number];
}) => {
  // Only create droppable for valid statuses
  if (!status) return null;
  
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <Column>
      <ColumnHeader style={{ backgroundColor: column.color }}>
        {column.title}
        <div style={{ fontSize: theme.fontSizes.sm, opacity: 0.8 }}>
          {columnBooks.length} book{columnBooks.length !== 1 ? 's' : ''}
        </div>
      </ColumnHeader>
      <ColumnContent
        ref={setNodeRef}
        data-status={status}
        style={{ 
          minHeight: '200px',
          padding: theme.spacing.md,
          backgroundColor: isOver ? `${column.color}20` : (columnBooks.length === 0 ? `${column.color}10` : 'transparent'),
          border: isOver ? `2px solid ${column.color}` : (columnBooks.length === 0 ? `2px dashed ${column.color}40` : '2px dashed transparent'),
          borderRadius: theme.borderRadius.md,
          transition: 'all 0.2s ease'
        }}
      >
        {children}
      </ColumnContent>
    </Column>
  );
};

export const BookBoard = ({ books, onBookStatusChange, className, style }: BookBoardProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getBooksByStatus = (status: ReadingStatus) => {
    return books.filter(book => book.status === status);
  };

  const getBooksWithStatus = () => {
    return books.filter(book => book.status !== null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    console.log('Drag started:', event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    console.log('Drag ended:', { active: active.id, over: over?.id });

    if (!over || !onBookStatusChange) {
      console.log('No valid drop target or no status change handler');
      return;
    }

    const activeBook = books.find(book => book.isbn === active.id);
    if (!activeBook) {
      console.log('Active book not found');
      return;
    }

    // Check if the drop target is a column (status)
    const newStatus = over.id as ReadingStatus;
    
    console.log('Status change:', { 
      book: activeBook.title, 
      from: activeBook.status, 
      to: newStatus 
    });
    
    // Only update if the status actually changed and it's a valid status
    if (activeBook.status !== newStatus && newStatus !== null) {
      onBookStatusChange(activeBook.isbn, newStatus);
      console.log('Status updated successfully');
    } else {
      console.log('Status unchanged or invalid');
    }
  };

  const getActiveBook = () => {
    return books.find(book => book.isbn === activeId);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <BoardContainer className={className} style={style}>
        {defaultColumns.map(column => {
          const columnBooks = getBooksByStatus(column.id);
          
          return (
            <DroppableColumn 
              key={column.id}
              status={column.id}
              columnBooks={columnBooks}
              column={column}
            >
              <SortableContext
                items={columnBooks.map(book => book.isbn)}
                strategy={verticalListSortingStrategy}
              >
                {columnBooks.length > 0 ? (
                  columnBooks.map((book, index) => (
                    <SortableBook 
                      key={`${book.isbn || book.title}-${index}`} 
                      book={book}
                      showStatus={true}
                    />
                  ))
                ) : (
                  <EmptyState>
                    Drop books here
                  </EmptyState>
                )}
              </SortableContext>
            </DroppableColumn>
          );
        })}
      </BoardContainer>
      
      <DragOverlay>
        {activeId ? (
          <Book 
            book={getActiveBook()!}
            showStatus={true}
            isDragging={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

// Styled Components
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
