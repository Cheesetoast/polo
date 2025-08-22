import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookBoard } from './BookBoard';

// Mock the useBookStatus hook
jest.mock('../hooks/useBookStatus', () => ({
  useBookStatus: () => ({
    booksWithStatus: [],
    updateBookStatus: jest.fn(),
  }),
}));

// Mock the Book component
jest.mock('./Book', () => ({
  Book: ({ book, onClick }: any) => (
    <div 
      data-testid={`book-${book.isbn}`}
      onClick={onClick}
    >
      <div>{book.title}</div>
      <div>{book.author}</div>
    </div>
  ),
}));

// Mock the data import to use the current books structure
jest.mock('../data/books.json', () => [
  {
    title: '1984',
    author: 'George Orwell',
    authorId: 'george-orwell',
    description: { description: 'A dystopian novel' },
    isbn: '978-0451524935',
    progress: 2,
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    authorId: 'f-scott-fitzgerald',
    description: { description: 'A story of the Jazz Age' },
    isbn: '978-0743273565',
    progress: 0,
  },
]);

describe('BookBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the book board with title', () => {
    render(<BookBoard />);
    
    expect(screen.getByText('My Reading Board')).toBeInTheDocument();
  });

  it('renders empty state when no books are organized', () => {
    render(<BookBoard />);
    
    expect(screen.getByText('No books organized yet')).toBeInTheDocument();
    expect(screen.getByText('Start by assigning a status to a book from the book detail page')).toBeInTheDocument();
  });

  it('shows no books when no statuses are assigned', () => {
    render(<BookBoard />);
    
    // No books should be rendered since no statuses are assigned
    expect(screen.queryByTestId('book-978-0743273565')).not.toBeInTheDocument();
    expect(screen.queryByTestId('book-978-0451524935')).not.toBeInTheDocument();
  });

  it('shows correct board title and subtitle', () => {
    render(<BookBoard />);
    
    expect(screen.getByText('My Reading Board')).toBeInTheDocument();
    // No subtitle should be shown when no books are organized
    expect(screen.queryByText(/0 book.*organized/)).not.toBeInTheDocument();
  });

  it('handles empty state correctly', () => {
    render(<BookBoard />);
    
    // Should show empty state message
    expect(screen.getByText('No books organized yet')).toBeInTheDocument();
    expect(screen.getByText('Start by assigning a status to a book from the book detail page')).toBeInTheDocument();
    
    // Should not show any columns
    expect(screen.queryByText('Want to Read')).not.toBeInTheDocument();
    expect(screen.queryByText('Currently Reading')).not.toBeInTheDocument();
    expect(screen.queryByText('Finished')).not.toBeInTheDocument();
  });
});
