import type { Meta, StoryObj } from '@storybook/react';
import { Dashboard } from './Dashboard';

const meta: Meta<typeof Dashboard> = {
  title: 'Components/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A dashboard component that displays reading statistics including book counts, genres, ratings, and book types.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    stats: {
      description: 'Statistics data to display',
      control: { type: 'object' },
    },
    className: {
      description: 'Additional CSS class name',
      control: { type: 'text' },
    },
    style: {
      description: 'Additional inline styles',
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dashboard>;

const mockStats = {
  totalBooks: 104,
  finishedBooks: 23,
  currentlyReading: 5,
  wantToRead: 76,
  topGenres: ['Fiction (25)', 'Science Fiction (18)', 'Mystery (12)'],
  averageRating: '4.2',
  typeCounts: {
    'paper': 45,
    'digital': 38,
    'audio': 21,
  },
};

export const Default: Story = {
  args: {
    stats: mockStats,
  },
};

export const EmptyStats: Story = {
  args: {
    stats: {
      totalBooks: 0,
      finishedBooks: 0,
      currentlyReading: 0,
      wantToRead: 0,
      topGenres: [],
      averageRating: 'N/A',
      typeCounts: {},
    },
  },
};

export const FewBooks: Story = {
  args: {
    stats: {
      totalBooks: 3,
      finishedBooks: 1,
      currentlyReading: 1,
      wantToRead: 1,
      topGenres: ['Fiction (2)', 'Non-Fiction (1)'],
      averageRating: '3.8',
      typeCounts: {
        'paper': 2,
        'digital': 1,
      },
    },
  },
};

export const ManyBooks: Story = {
  args: {
    stats: {
      totalBooks: 500,
      finishedBooks: 150,
      currentlyReading: 25,
      wantToRead: 325,
      topGenres: ['Fiction (120)', 'Science Fiction (85)', 'Mystery (65)', 'Romance (45)'],
      averageRating: '4.5',
      typeCounts: {
        'paper': 200,
        'digital': 180,
        'audio': 120,
      },
    },
  },
};

export const WithCustomStyling: Story = {
  args: {
    stats: mockStats,
    style: {
      backgroundColor: '#f8f9fa',
      border: '2px solid #e9ecef',
      borderRadius: '12px',
    },
  },
};

export const WithCustomClassName: Story = {
  args: {
    stats: mockStats,
    className: 'custom-dashboard',
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard with a custom CSS class applied.',
      },
    },
  },
};
