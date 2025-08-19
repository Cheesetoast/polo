import React from 'react';
import { render } from '@testing-library/react';
import { BookBoardContainer } from '../BookBoardContainer';

jest.mock('../../hooks/useBookStatus', () => ({
  useBookStatus: () => ({
    booksWithStatus: [],
    updateBookStatus: jest.fn(),
    updateBookProgress: jest.fn(),
    resetStatuses: jest.fn(),
    clearLocalStorage: jest.fn(),
    isLoading: false,
  }),
}));

describe('BookBoardContainer', () => {
  it('renders without crashing', () => {
    const { container } = render(<BookBoardContainer books={[]} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with title and reset button flag variations', () => {
    const { container, rerender } = render(
      <BookBoardContainer books={[]} title="My List" showResetButton={false} />
    );
    expect(container.firstChild).toBeTruthy();
    rerender(<BookBoardContainer books={[]} title="Other" showResetButton />);
    expect(container.firstChild).toBeTruthy();
  });
});
