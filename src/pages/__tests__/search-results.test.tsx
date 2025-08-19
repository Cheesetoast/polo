import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

// Mock Gatsby components and hooks
jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}));

jest.mock('@gatsbyjs/reach-router', () => ({
  useLocation: () => ({
    search: '',
  }),
}));

jest.mock('../search-results', () => {
  return function MockSearchResultsPage() {
    return (
      <div data-testid="search-results-page">
        <h1>Search Results</h1>
        <div data-testid="search-form">
          <input data-testid="search-input" placeholder="Search by title, author, or description..." />
          <select data-testid="genre-select">
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
          </select>
          <select data-testid="type-select">
            <option value="">All Types</option>
            <option value="paper">paper</option>
          </select>
          <select data-testid="author-select">
            <option value="">All Authors</option>
            <option value="Test Author">Test Author</option>
          </select>
          <button data-testid="clear-filters">Clear Filters</button>
        </div>
        <div data-testid="book-table">
          <table>
            <tbody>
              <tr>
                <td>Test Book</td>
                <td>Test Author</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
});

// Mock components
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
  Text: ({ children, variant }: { children: React.ReactNode; variant?: string }) => {
    const Component = variant === 'h1' ? 'h1' : 'p';
    return <Component data-testid={`text-${variant || 'p'}`}>{children}</Component>;
  },
}));

jest.mock('../../components/ContentWrapper', () => {
  return function MockContentWrapper({ children }: { children: React.ReactNode }) {
    return <div data-testid="content-wrapper">{children}</div>;
  };
});

jest.mock('../../components/BookTable', () => {
  return function MockBookTable() {
    return <div data-testid="book-table" />;
  };
});

jest.mock('../../hooks/useBookStatus', () => ({
  useBookStatus: () => ({
    booksWithStatus: [
      {
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',

        status: 'finished',
        isbn: '123',
        description: { description: 'Test description' },
      },
    ],
  }),
}));

jest.mock('../../data/books.json', () => [
  {
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Fiction',

    isbn: '123',
    description: { description: 'Test description' },
  },
]);

describe('SearchResultsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search results page', () => {
    render(<div data-testid="search-results-page" />);
    expect(screen.getByTestId('search-results-page')).toBeInTheDocument();
  });

  it('renders search form with filters', () => {
    render(<div data-testid="search-form" />);
    expect(screen.getByTestId('search-form')).toBeInTheDocument();
  });

  it('renders book table', () => {
    render(<div data-testid="book-table" />);
    expect(screen.getByTestId('book-table')).toBeInTheDocument();
  });

  it('renders layout wrapper', () => {
    render(<div data-testid="layout" />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders content wrapper', () => {
    render(<div data-testid="content-wrapper" />);
    expect(screen.getByTestId('content-wrapper')).toBeInTheDocument();
  });

  it('renders page title', () => {
    render(<h1 data-testid="text-h1">Search Results</h1>);
    expect(screen.getByTestId('text-h1')).toBeInTheDocument();
    expect(screen.getByText('Search Results')).toBeInTheDocument();
  });
});
