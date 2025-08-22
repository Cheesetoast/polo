import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStaticQuery } from 'gatsby';
import BookPage from '../book/[slug]';

// Mock Gatsby components and hooks
jest.mock('gatsby', () => ({
  useStaticQuery: jest.fn(),
  navigate: jest.fn(),
}));

jest.mock('../../components/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

jest.mock('../../components/SEO', () => {
  return function MockSEO() {
    return <div data-testid="seo" />;
  };
});

jest.mock('../../components/Text', () => ({
  Text: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
    <div data-testid={`text-${variant || 'default'}`}>{children}</div>
  ),
}));

jest.mock('../../components/ContentWrapper', () => ({
  ContentWrapper: ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="content-wrapper">{children}</div>;
  },
}));

jest.mock('../../components/Button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button data-testid="button" onClick={onClick}>{children}</button>
  ),
}));

jest.mock('../../components/BookProgressBar', () => ({
  BookProgressBar: ({ progress }: { progress: number }) => (
    <div data-testid="progress-bar">{progress}%</div>
  ),
}));

jest.mock('../../components/StatusIndicator', () => ({
  StatusIndicator: ({ status, size }: { status: string; size: string }) => (
    <div data-testid="status-indicator" data-status={status} data-size={size} />
  ),
}));

jest.mock('../../components/ImageBlock', () => ({
  ImageBlock: ({ image, alt }: { image: any; alt: string }) => (
    <img data-testid="image" alt={alt} />
  ),
}));

jest.mock('../../hooks/useBookStatus', () => ({
  useBookStatus: () => ({
    booksWithStatus: [
      {
        title: 'Test Book',
        author: 'Test Author',
        description: { description: 'Test description' },
        isbn: '978-1234567890',
        communityRating: 4.5,
        userRating: 4.0,
        genres: ['Fiction'],
        progress: 100,
        dateStarted: '2023-01-01',
        dateFinished: '2023-01-15',
        pages: 300,
        status: 'finished'
      }
    ]
  }),
}));

jest.mock('../../data/books.json', () => [
  {
    title: 'Test Book',
    author: 'Test Author',
    description: { description: 'Test description' },
    isbn: '978-1234567890',
    communityRating: 4.5,
    userRating: 4.0,
    genres: ['Fiction'],
            progress: 100,
        dateStarted: '2023-01-01',
        dateFinished: '2023-01-15',
    pages: 300
  }
]);

describe('BookPage', () => {
  beforeEach(() => {
    (useStaticQuery as jest.Mock).mockReturnValue({
      contentfulHomepage: {
        title: 'Test Homepage'
      }
    });
  });

  it('renders book details when book is found', () => {
    const params = { slug: '9781234567890' };
    
    render(<BookPage params={params} />);

    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('By Test Author')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('978-1234567890')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
    expect(screen.getByText('4.0 (your rating)')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders not found page when book is not found', () => {
    const params = { slug: 'non-existent-isbn' };
    
    render(<BookPage params={params} />);

    expect(screen.getByText('Book Not Found')).toBeInTheDocument();
    expect(screen.getByText("The book you're looking for doesn't exist.")).toBeInTheDocument();
    expect(screen.getByText('Back to Search')).toBeInTheDocument();
  });

  it('displays status indicator', () => {
    const params = { slug: '9781234567890' };
    
    render(<BookPage params={params} />);

    const statusIndicator = screen.getByTestId('status-indicator');
    expect(statusIndicator).toBeInTheDocument();
    expect(statusIndicator).toHaveAttribute('data-status', 'finished');
    expect(statusIndicator).toHaveAttribute('data-size', 'large');
  });

  it('displays progress bar when progress is available', () => {
    const params = { slug: '9781234567890' };
    
    render(<BookPage params={params} />);

    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('displays back button', () => {
    const params = { slug: '9781234567890' };
    
    render(<BookPage params={params} />);

    expect(screen.getByText('← Back to Search')).toBeInTheDocument();
  });
});
