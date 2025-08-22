import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookBoard } from './BookBoard';
import { ReadingStatus } from '../types/reading';

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

describe('BookBoard', () => {
  const mockBooksWithStatus = [
    {
      title: '1984',
      author: 'George Orwell',
      authorId: 'george-orwell',
      description: { description: 'A dystopian novel' },
      isbn: '978-0451524935',
      status: 'finished' as ReadingStatus,
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      authorId: 'f-scott-fitzgerald',
      description: { description: 'A story of the Jazz Age' },
      isbn: '978-0743273565',
      status: 'want-to-read' as ReadingStatus,
    },
  ];

  const mockUpdateBookStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the book board with title', () => {
    render(
      <BookBoard 
        booksWithStatus={mockBooksWithStatus}
        updateBookStatus={mockUpdateBookStatus}
      />
    );
    
    expect(screen.getByText('My Reading Board')).toBeInTheDocument();
  });

  it('renders empty state when no books are organized', () => {
    render(
      <BookBoard 
        booksWithStatus={[]}
        updateBookStatus={mockUpdateBookStatus}
      />
    );
    
    expect(screen.getByText('No books organized yet')).toBeInTheDocument();
    expect(screen.getByText('Start by assigning a status to a book from the book detail page')).toBeInTheDocument();
  });

  it('shows no books when no statuses are assigned', () => {
    const booksWithNoStatus = mockBooksWithStatus.map(book => ({ ...book, status: null }));
    
    render(
      <BookBoard 
        booksWithStatus={booksWithNoStatus}
        updateBookStatus={mockUpdateBookStatus}
      />
    );
    
    expect(screen.getByText('No books organized yet')).toBeInTheDocument();
  });

  it('shows correct board title and subtitle', () => {
    render(
      <BookBoard 
        booksWithStatus={mockBooksWithStatus}
        updateBookStatus={mockUpdateBookStatus}
      />
    );
    
    expect(screen.getByText('My Reading Board')).toBeInTheDocument();
    expect(screen.getByText('2 books organized')).toBeInTheDocument();
  });

  it('handles empty state correctly', () => {
    render(
      <BookBoard 
        booksWithStatus={[]}
        updateBookStatus={mockUpdateBookStatus}
      />
    );
    
    // Should show empty state message
    expect(screen.getByText('No books organized yet')).toBeInTheDocument();
    expect(screen.getByText('Start by assigning a status to a book from the book detail page')).toBeInTheDocument();
    
    // Should not show any columns
    expect(screen.queryByText('Want to Read')).not.toBeInTheDocument();
    expect(screen.queryByText('Currently Reading')).not.toBeInTheDocument();
    expect(screen.queryByText('Finished')).not.toBeInTheDocument();
  });
});
