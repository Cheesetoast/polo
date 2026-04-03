import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStaticQuery } from 'gatsby';

import IndexPage from '../index';
import SearchPage from '../search';
import SearchResultsPage from '../search-results';
import BookshelfPage from '../bookshelf';
import AuthorsPage from '../authors';
import GenresPage from '../genres';
import ProjectPage from '../project';
import StyleguidePage from '../styleguide';
import NotFoundPage from '../404';
import Dev404Page from '../dev-404-page';
import BookPage from '../book/[slug]';
import GenrePage from '../genre/[genre]';
import AuthorPage from '../author/[id]';

jest.mock('@gatsbyjs/reach-router', () => ({
  useLocation: () => ({
    search: '',
    pathname: '/search-results',
    href: 'http://localhost/search-results',
  }),
}));

jest.mock('../../components/Book', () => {
  const actual = jest.requireActual('../../components/Book');
  return {
    ...actual,
    Book: ({ book }: { book: { title: string } }) => (
      <div data-testid="book-card-smoke">{book.title}</div>
    ),
  };
});

describe('page smoke (initial render)', () => {
  beforeEach(() => {
    (useStaticQuery as jest.Mock).mockReturnValue({
      contentfulHomepage: { title: null },
    });
  });

  it('renders home (index)', () => {
    render(<IndexPage />);
    expect(screen.getByText('Find your next great read')).toBeInTheDocument();
  });

  it('renders search', () => {
    render(<SearchPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Search Books' })
    ).toBeInTheDocument();
  });

  it('renders search-results', () => {
    render(<SearchResultsPage />);
    expect(screen.getByText('Search Results')).toBeInTheDocument();
  });

  it('renders bookshelf', () => {
    render(<BookshelfPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'My Bookshelf' })
    ).toBeInTheDocument();
  });

  it('renders authors', () => {
    render(<AuthorsPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Authors' })
    ).toBeInTheDocument();
  });

  it('renders genres', () => {
    render(<GenresPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Genres' })
    ).toBeInTheDocument();
  });

  it('renders project', () => {
    render(<ProjectPage />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('renders styleguide', () => {
    render(<StyleguidePage />);
    expect(screen.getByText('Style guide')).toBeInTheDocument();
  });

  it('renders 404', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('renders dev-404', () => {
    render(<Dev404Page />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('renders book detail for a known slug', () => {
    render(<BookPage params={{ slug: '97801000000000' }} />);
    expect(screen.getByText('1984')).toBeInTheDocument();
  });

  it('renders genre page for a genre with books', () => {
    render(<GenrePage params={{ genre: 'Fiction' }} />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Fiction' })
    ).toBeInTheDocument();
  });

  it('renders genre page for author-only genre (books via author tags)', () => {
    render(<GenrePage params={{ genre: 'Social Commentary' }} />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Social Commentary' })
    ).toBeInTheDocument();
    expect(screen.queryByText('No Books Found')).not.toBeInTheDocument();
  });

  it('renders author page for a known id', () => {
    render(<AuthorPage params={{ id: 'george-orwell' }} />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'George Orwell' })
    ).toBeInTheDocument();
  });

  it('renders author not-found branch without throwing', () => {
    render(<AuthorPage params={{ id: 'no-such-author-id' }} />);
    expect(screen.getByText('Author Not Found')).toBeInTheDocument();
  });
});
