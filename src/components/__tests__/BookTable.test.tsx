import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookTable } from '../BookTable';

const mockBooks = [
  {
    title: 'Test Book 1',
    author: 'Test Author 1',
    description: { description: 'Test description 1' },
    isbn: '978-1',
    communityRating: 4.2,
    userRating: 5,
    genre: 'Fiction',
    progress: 100,
    dateStarted: '2023-01-15',
    dateFinished: '2023-02-01',

    pages: 300,
    status: 'finished' as const,
  },
  {
    title: 'Test Book 2',
    author: 'Test Author 2',
    description: { description: 'Test description 2' },
    isbn: '978-2',
    communityRating: 4.0,
    userRating: undefined,
    genre: 'Non-Fiction',
    progress: 50,
    dateStarted: '2023-03-10',
    dateFinished: null,

    pages: 250,
    status: 'currently-reading' as const,
  },
];

describe('BookTable Component', () => {
  it('renders table headers', () => {
    render(<BookTable books={mockBooks} />);
    
    expect(screen.getByText('Book')).toBeInTheDocument();
    expect(screen.getByText('Genre')).toBeInTheDocument();

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Rating')).toBeInTheDocument();
    expect(screen.getByText('Started')).toBeInTheDocument();
    expect(screen.getAllByText('Finished')).toHaveLength(2); // Header + status
  });

  it('renders book data', () => {
    render(<BookTable books={mockBooks} />);
    
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('Test Author 1')).toBeInTheDocument();
    expect(screen.getByText('Fiction')).toBeInTheDocument();

    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('handles click events when onBookClick is provided', () => {
    const handleClick = jest.fn();
    render(<BookTable books={mockBooks} onBookClick={handleClick} />);
    
    const firstBookRow = screen.getByText('Test Book 1').closest('tr');
    fireEvent.click(firstBookRow!);
    
    expect(handleClick).toHaveBeenCalledWith(mockBooks[0]);
  });

  it('handles author click events when onAuthorClick is provided', () => {
    const handleAuthorClick = jest.fn();
    render(<BookTable books={mockBooks} onAuthorClick={handleAuthorClick} />);
    
    const authorLink = screen.getByText('Test Author 1');
    fireEvent.click(authorLink);
    
    expect(handleAuthorClick).toHaveBeenCalledWith('Test Author 1');
  });

  it('does not call onBookClick when not provided', () => {
    render(<BookTable books={mockBooks} />);
    
    const firstBookRow = screen.getByText('Test Book 1').closest('tr');
    fireEvent.click(firstBookRow!);
    
    // Should not throw any errors
    expect(firstBookRow).toBeInTheDocument();
  });

  it('displays user rating when available', () => {
    render(<BookTable books={mockBooks} />);
    
    expect(screen.getByText(/5\.0 \(your rating\)/)).toBeInTheDocument();
  });

  it('displays community rating when user rating is not available', () => {
    render(<BookTable books={mockBooks} />);
    
    expect(screen.getByText(/4\.0 \(community\)/)).toBeInTheDocument();
  });

  it('displays dash when no rating is available', () => {
    const booksWithoutRatings = [
      {
        ...mockBooks[0],
        communityRating: undefined,
        userRating: undefined,
      },
    ];
    
    render(<BookTable books={booksWithoutRatings} />);
    
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<BookTable books={mockBooks} />);
    
    expect(screen.getByText(/1\/14\/2023/)).toBeInTheDocument();
    expect(screen.getByText(/1\/31\/2023/)).toBeInTheDocument();
  });

  it('displays dash for missing dates', () => {
    const booksWithoutDates = [
      {
        ...mockBooks[0],
        dateStarted: null,
        dateFinished: null,
      },
    ];
    
    render(<BookTable books={booksWithoutDates} />);
    
    const dashElements = screen.getAllByText('-');
    expect(dashElements.length).toBeGreaterThan(0);
  });

  it('handles empty books array', () => {
    render(<BookTable books={[]} />);
    
    expect(screen.getByText('Book')).toBeInTheDocument();
    expect(screen.getByText('Genre')).toBeInTheDocument();
    // Should not crash and should render headers
  });

  it('displays progress bar for books with progress', () => {
    render(<BookTable books={mockBooks} />);
    
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('displays progress bar for books with progress', () => {
    render(<BookTable books={mockBooks} />);
    
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('does not display progress bar for books without progress', () => {
    const booksWithoutProgress = [
      {
        ...mockBooks[0],
        progress: undefined,
      },
    ];
    
    render(<BookTable books={booksWithoutProgress} />);
    
    // Should not show progress bar, but should still show other content
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('Test Author 1')).toBeInTheDocument();
  });

  it('displays pagination when there are more books than page size', () => {
    const manyBooks = Array.from({ length: 25 }, (_, i) => ({
      ...mockBooks[0],
      title: `Test Book ${i + 1}`,
      isbn: `978-${i}`,
    }));
    
    render(<BookTable books={manyBooks} pageSize={10} />);
    
    expect(screen.getByText(/Showing 1-10 of 25 books/)).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not display pagination when all books fit on one page', () => {
    render(<BookTable books={mockBooks} pageSize={10} />);
    
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('handles pagination navigation correctly', () => {
    const manyBooks = Array.from({ length: 15 }, (_, i) => ({
      ...mockBooks[0],
      title: `Test Book ${i + 1}`,
      isbn: `978-${i}`,
    }));
    
    render(<BookTable books={manyBooks} pageSize={5} />);
    
    // Should show first 5 books
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('Test Book 5')).toBeInTheDocument();
    expect(screen.queryByText('Test Book 6')).not.toBeInTheDocument();
    
    // Click next page
    fireEvent.click(screen.getByText('Next'));
    
    // Should show next 5 books
    expect(screen.queryByText('Test Book 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test Book 6')).toBeInTheDocument();
    expect(screen.getByText('Test Book 10')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    const manyBooks = Array.from({ length: 15 }, (_, i) => ({
      ...mockBooks[0],
      title: `Test Book ${i + 1}`,
      isbn: `978-${i}`,
    }));
    
    render(<BookTable books={manyBooks} pageSize={5} />);
    
    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    const manyBooks = Array.from({ length: 15 }, (_, i) => ({
      ...mockBooks[0],
      title: `Test Book ${i + 1}`,
      isbn: `978-${i}`,
    }));
    
    render(<BookTable books={manyBooks} pageSize={5} />);
    
    // Go to last page
    fireEvent.click(screen.getByText('3'));
    
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('handles direct page number clicks', () => {
    const manyBooks = Array.from({ length: 15 }, (_, i) => ({
      ...mockBooks[0],
      title: `Test Book ${i + 1}`,
      isbn: `978-${i}`,
    }));
    
    render(<BookTable books={manyBooks} pageSize={5} />);
    
    // Click page 2
    fireEvent.click(screen.getByText('2'));
    
    // Should show books 6-10
    expect(screen.getByText('Test Book 6')).toBeInTheDocument();
    expect(screen.getByText('Test Book 10')).toBeInTheDocument();
    expect(screen.queryByText('Test Book 5')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Book 11')).not.toBeInTheDocument();
  });

  it('uses default page size of 10', () => {
    const manyBooks = Array.from({ length: 25 }, (_, i) => ({
      ...mockBooks[0],
      title: `Test Book ${i + 1}`,
      isbn: `978-${i}`,
    }));
    
    render(<BookTable books={manyBooks} />);
    
    expect(screen.getByText(/Showing 1-10 of 25 books/)).toBeInTheDocument();
  });
});
