import React from 'react';
import { render } from '@testing-library/react';
import { Dashboard } from '../Dashboard';

const mockStats = {
  totalBooks: 25,
  finishedBooks: 15,
  currentlyReading: 5,
  wantToRead: 5,
  topGenres: ['Fiction', 'Non-Fiction', 'Science Fiction'],
  averageRating: '4.2',
  typeCounts: {
    paper: 10,
    digital: 10,
    audio: 5,
  },
};

const mockYearInBooksStats = {
  booksRead: 12,
  pagesRead: 3500,
  averageRating: 4.3,
  topBooks: [
    {
      title: 'Test Book 1',
      author: 'Test Author 1',
      description: { description: 'Test description 1' },
      isbn: '978-1',
      communityRating: 4.5,
      userRating: 5,
      genre: 'Fiction',
      pages: 300,
      dateFinished: '2023-06-15',
      type: 'paper',
    },
    {
      title: 'Test Book 2',
      author: 'Test Author 2',
      description: { description: 'Test description 2' },
      isbn: '978-2',
      communityRating: 4.0,
      userRating: 4,
      genre: 'Non-Fiction',
      pages: 250,
      dateFinished: '2023-07-20',
      type: 'digital',
    },
  ],
  favoriteGenre: 'Fiction',
};

describe('Dashboard Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Dashboard stats={mockStats} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with year-in-books stats without crashing', () => {
    const { container } = render(
      <Dashboard stats={mockStats} yearInBooksStats={mockYearInBooksStats} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('handles empty stats gracefully', () => {
    const emptyStats = {
      totalBooks: 0,
      finishedBooks: 0,
      currentlyReading: 0,
      wantToRead: 0,
      topGenres: [],
      averageRating: '0.0',
      typeCounts: {},
    };
    const { container } = render(<Dashboard stats={emptyStats} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('handles empty year-in-books stats gracefully', () => {
    const emptyYearStats = {
      booksRead: 0,
      pagesRead: 0,
      averageRating: 0,
      topBooks: [],
      favoriteGenre: 'None',
    };
    const { container } = render(
      <Dashboard stats={mockStats} yearInBooksStats={emptyYearStats} />
    );
    expect(container.firstChild).toBeTruthy();
  });
});
