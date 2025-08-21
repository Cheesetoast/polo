import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookBoard } from './BookBoard';
import { Book } from './Book';

// Mock the @dnd-kit modules
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children, onDragStart, onDragEnd }: any) => (
    <div data-testid="dnd-context" onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {children}
    </div>
  ),
  DragOverlay: ({ children }: any) => <div data-testid="drag-overlay">{children}</div>,
  PointerSensor: jest.fn(),
  useSensor: jest.fn(() => ({})),
  useSensors: jest.fn(() => []),
  useDroppable: jest.fn(() => ({ setNodeRef: jest.fn(), isOver: false })),
}));

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => <div data-testid="sortable-context">{children}</div>,
  verticalListSortingStrategy: jest.fn(),
  useSortable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn(() => ''),
    },
  },
}));

// Mock the Book component
jest.mock('./Book', () => ({
  Book: ({ book, dragHandleProps, isDragging }: any) => (
    <div 
      data-testid={`book-${book.isbn}`}
      data-dragging={isDragging}
      {...dragHandleProps}
    >
      <div>{book.title}</div>
      <div>{book.author}</div>
      <div data-testid="drag-handle">⋮⋮</div>
    </div>
  ),
}));

const mockBooks = [
  {
    title: 'Test Book 1',
    author: 'Test Author 1',
    description: { description: 'Test description 1' },
    isbn: 'test-isbn-1',
    status: 'want-to-read' as const,
  },
  {
    title: 'Test Book 2',
    author: 'Test Author 2',
    description: { description: 'Test description 2' },
    isbn: 'test-isbn-2',
    status: 'currently-reading' as const,
  },
];

describe('BookBoard', () => {
  const mockOnBookStatusChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the book board with columns', () => {
    render(<BookBoard books={mockBooks} onBookStatusChange={mockOnBookStatusChange} />);
    
    expect(screen.getByText('Want to Read')).toBeInTheDocument();
    expect(screen.getByText('Currently Reading')).toBeInTheDocument();
    expect(screen.getByText('Finished')).toBeInTheDocument();
  });

  it('renders books in their respective columns', () => {
    render(<BookBoard books={mockBooks} onBookStatusChange={mockOnBookStatusChange} />);
    
    expect(screen.getByTestId('book-test-isbn-1')).toBeInTheDocument();
    expect(screen.getByTestId('book-test-isbn-2')).toBeInTheDocument();
  });

  it('renders drag handles on books', () => {
    render(<BookBoard books={mockBooks} onBookStatusChange={mockOnBookStatusChange} />);
    
    const dragHandles = screen.getAllByTestId('drag-handle');
    expect(dragHandles).toHaveLength(2);
  });

  it('renders empty state when no books in column', () => {
    render(<BookBoard books={[]} onBookStatusChange={mockOnBookStatusChange} />);
    
    const emptyStates = screen.getAllByText('Drop books here');
    expect(emptyStates).toHaveLength(3); // One for each column
  });

  it('renders DndContext wrapper', () => {
    render(<BookBoard books={mockBooks} onBookStatusChange={mockOnBookStatusChange} />);
    
    expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
  });

  it('renders SortableContext for each column', () => {
    render(<BookBoard books={mockBooks} onBookStatusChange={mockOnBookStatusChange} />);
    
    const sortableContexts = screen.getAllByTestId('sortable-context');
    expect(sortableContexts.length).toBeGreaterThan(0);
  });
});
