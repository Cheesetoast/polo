import React from 'react';
import { render, screen } from '@testing-library/react';
import { Book } from '../Book';

const mockBook = {
  title: 'Test Book',
  author: 'Test Author',
  description: {
    description: 'A test book description'
  },
  isbn: '978-1234567890',
  communityRating: 4.2,
  userRating: 5,
  genre: 'Fiction',
  progress: 75,
  dateStarted: '2023-01-01',
  dateFinished: '2023-01-15',
  
  pages: 300
};

describe('Book Component', () => {
  it('renders book title and author', () => {
    render(<Book book={mockBook} />);
    
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText(/Test Author/)).toBeInTheDocument();
  });

  it('renders book description', () => {
    render(<Book book={mockBook} />);
    
    expect(screen.getByText('A test book description')).toBeInTheDocument();
  });

  it('renders community rating', () => {
    render(<Book book={mockBook} />);
    
    expect(screen.getByText('(4.2)')).toBeInTheDocument();
  });

  it('renders user rating when book is finished', () => {
    render(<Book book={mockBook} />);
    
    expect(screen.getByText('(5.0)')).toBeInTheDocument();
  });

  it('does not render user rating when book is not finished', () => {
    const unfinishedBook = { ...mockBook, dateFinished: null, userRating: undefined };
    render(<Book book={unfinishedBook} />);
    
    expect(screen.queryByText('(5.0)')).not.toBeInTheDocument();
  });

  it('renders genre and type tags', () => {
    render(<Book book={mockBook} />);
    
    expect(screen.getByText('Fiction')).toBeInTheDocument();

  });

  it('renders progress bar when progress is defined', () => {
    render(<Book book={mockBook} />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders start and finish dates', () => {
    render(<Book book={mockBook} />);
    
    // Check that dates are rendered (without checking specific format)
    expect(screen.getByText(/12\/31\/2022/)).toBeInTheDocument();
    expect(screen.getByText(/1\/14\/2023/)).toBeInTheDocument();
  });

  it('renders ISBN', () => {
    render(<Book book={mockBook} />);
    
    expect(screen.getByText(/978-1234567890/)).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Book book={mockBook} onClick={handleClick} />);
    
    const bookElement = screen.getByText('Test Book').closest('div');
    bookElement?.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
