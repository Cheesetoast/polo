import React from 'react';
import { render } from '@testing-library/react';
import { BooksContainer } from '../BooksContainer';
import { Book } from '../Book';

const books: Book[] = [
  { title: 'A', author: 'AA', description: { description: 'x' }, isbn: '1' },
  { title: 'B', author: 'BB', description: { description: 'y' }, isbn: '2' },
];

describe('BooksContainer', () => {
  it('renders a list of Book items', () => {
    const { container } = render(<BooksContainer books={books} />);
    expect(container.firstChild).toBeTruthy();
  });
});
