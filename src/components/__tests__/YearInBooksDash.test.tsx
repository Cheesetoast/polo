import React from 'react';
import { render } from '@testing-library/react';
import { YearInBooksDash } from '../YearInBooksDash';
import { Book } from '../Book';

const books: Book[] = [
  { title: 'A', author: 'AA', description: { description: 'x' }, isbn: '1', pages: 100, userRating: 5, dateFinished: '2023-06-01' },
  { title: 'B', author: 'BB', description: { description: 'y' }, isbn: '2', pages: 200, communityRating: 4.2, dateFinished: '2023-07-01' },
];

const stats = {
  booksRead: 2,
  pagesRead: 300,
  averageRating: 4.6,
  topBooks: books,
  favoriteGenre: 'Fiction',
};

describe('YearInBooksDash', () => {
  it('renders without crashing with stats', () => {
    const { container } = render(<YearInBooksDash stats={stats} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with empty stats', () => {
    const empty = { booksRead: 0, pagesRead: 0, averageRating: 0, topBooks: [], favoriteGenre: 'None' };
    const { container } = render(<YearInBooksDash stats={empty} />);
    expect(container.firstChild).toBeTruthy();
  });
});
