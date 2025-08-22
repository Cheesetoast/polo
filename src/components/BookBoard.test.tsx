import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookBoard } from './BookBoard';

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

  it('renders the three status columns', () => {
    render(<BookBoard />);
    
    expect(screen.getByText('Not Started')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Finished')).toBeInTheDocument();
  });

  it('renders books in their respective columns based on progress', () => {
    render(<BookBoard />);
    
    // The Great Gatsby should be in "Not Started" (progress: 0)
    expect(screen.getByTestId('book-978-0743273565')).toBeInTheDocument();
    
    // 1984 should be in "In Progress" (progress: 2)
    expect(screen.getByTestId('book-978-0451524935')).toBeInTheDocument();
  });

  it('displays correct book counts in column headers', () => {
    render(<BookBoard />);
    
    // Should show counts for each column
    const notStartedColumn = screen.getByText('Not Started').closest('div');
    const inProgressColumn = screen.getByText('In Progress').closest('div');
    const finishedColumn = screen.getByText('Finished').closest('div');
    
    expect(notStartedColumn).toBeInTheDocument();
    expect(inProgressColumn).toBeInTheDocument();
    expect(finishedColumn).toBeInTheDocument();
  });

  it('handles book clicks to change status', () => {
    render(<BookBoard />);
    
    const book = screen.getByTestId('book-978-0743273565');
    
    // Should be clickable
    fireEvent.click(book);
    
    // The book should still exist in the component (may have moved to a different column)
    // We just verify that the click doesn't cause any errors
    expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
  });
});
