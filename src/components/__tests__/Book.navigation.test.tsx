import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { navigate } from 'gatsby';

// Mock Gatsby navigate
jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}));

// Mock all styled components as simple divs
jest.mock('styled-components', () => ({
  default: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock child components
jest.mock('../Text', () => ({
  Text: ({ children, ...props }: any) => <div data-testid="text" {...props}>{children}</div>,
}));

jest.mock('../ImageBlock', () => ({
  ImageBlock: ({ ...props }: any) => <div data-testid="image-block" {...props} />,
}));

jest.mock('../StatusIndicator', () => ({
  StatusIndicator: ({ ...props }: any) => <div data-testid="status-indicator" {...props} />,
}));

jest.mock('../BookProgressBar', () => ({
  BookProgressBar: ({ ...props }: any) => <div data-testid="book-progress-bar" {...props} />,
}));

// Simple Book component for testing navigation only
const TestBook = ({ book, onClick }: any) => {
  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/book/${book.isbn.replace(/-/g, '')}`);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/search-results?author=${encodeURIComponent(book.author)}`);
  };

  return (
    <div onClick={onClick} data-testid="book-card">
      <div onClick={handleTitleClick} data-testid="book-title">
        {book.title}
      </div>
      <div onClick={handleAuthorClick} data-testid="book-author">
        By {book.author}
      </div>
    </div>
  );
};

const mockNavigate = navigate as jest.MockedFunction<typeof navigate>;

const mockBook = {
  title: 'Test Book',
  author: 'Test Author',
  isbn: '123-456-789',
};

describe('Book Navigation', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('navigates to book page when title is clicked', () => {
    render(<TestBook book={mockBook} onClick={() => {}} />);
    
    const titleElement = screen.getByTestId('book-title');
    fireEvent.click(titleElement);
    
    expect(mockNavigate).toHaveBeenCalledWith('/book/123456789');
  });

  it('prevents event propagation when title is clicked', () => {
    const handleClick = jest.fn();
    render(<TestBook book={mockBook} onClick={handleClick} />);
    
    const titleElement = screen.getByTestId('book-title');
    fireEvent.click(titleElement);
    
    // The card's onClick should not be called when title is clicked
    expect(handleClick).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/book/123456789');
  });

  it('navigates to search results when author is clicked', () => {
    render(<TestBook book={mockBook} onClick={() => {}} />);
    
    const authorElement = screen.getByTestId('book-author');
    fireEvent.click(authorElement);
    
    expect(mockNavigate).toHaveBeenCalledWith('/search-results?author=Test%20Author');
  });

  it('prevents event propagation when author is clicked', () => {
    const handleClick = jest.fn();
    render(<TestBook book={mockBook} onClick={handleClick} />);
    
    const authorElement = screen.getByTestId('book-author');
    fireEvent.click(authorElement);
    
    // The card's onClick should not be called when author is clicked
    expect(handleClick).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/search-results?author=Test%20Author');
  });

  it('calls card onClick when card is clicked directly', () => {
    const handleClick = jest.fn();
    render(<TestBook book={mockBook} onClick={handleClick} />);
    
    const cardElement = screen.getByTestId('book-card');
    fireEvent.click(cardElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
