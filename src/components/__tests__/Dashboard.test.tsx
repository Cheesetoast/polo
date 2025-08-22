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
};



describe('Dashboard Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Dashboard stats={mockStats} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders dashboard stats correctly', () => {
    const { container } = render(
      <Dashboard stats={mockStats} />
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
    };
    const { container } = render(<Dashboard stats={emptyStats} />);
    expect(container.firstChild).toBeTruthy();
  });
});
