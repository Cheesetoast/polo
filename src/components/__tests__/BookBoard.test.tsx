import React from 'react';
import { render } from '@testing-library/react';
import { BookBoard, BookWithReadingStatus } from '../BookBoard';

describe('BookBoard', () => {
  const books: BookWithReadingStatus[] = [
    { title: 'A', author: 'AA', description: { description: 'x' }, isbn: '1', status: 'want-to-read' },
    { title: 'B', author: 'BB', description: { description: 'y' }, isbn: '2', status: 'currently-reading' },
    { title: 'C', author: 'CC', description: { description: 'z' }, isbn: '3', status: 'finished' },
  ];

  it('renders without crashing', () => {
    const { container } = render(<BookBoard books={books} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with onBookStatusChange prop without crashing', () => {
    const onChange = jest.fn();
    const { container } = render(<BookBoard books={books} onBookStatusChange={onChange} />);
    expect(container.firstChild).toBeTruthy();
  });
});
