import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { YearInBooksDash } from './YearInBooksDash';
import { Book } from './Book';

const meta: Meta<typeof YearInBooksDash> = {
  title: 'Components/YearInBooksDash',
  component: YearInBooksDash,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A dashboard component that displays year-in-books statistics including books read, pages read, average rating, and top books for the current year.',
      },
    },
  },
  argTypes: {
    stats: {
      control: 'object',
      description: 'Year-in-books statistics data',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class name',
    },
    style: {
      control: 'object',
      description: 'Additional inline styles',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for stories
const mockBooks: Book[] = [
  {
    title: "1984",
    author: "George Orwell",
    description: { description: "A dystopian novel about totalitarianism." },
    isbn: "978-0451524935",
    communityRating: 4.2,
    userRating: 5,
    genre: "Science Fiction",
    pages: 328,
    dateFinished: "2023-03-15",
    type: "paper"
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: { description: "A story of the fabulously wealthy Jay Gatsby." },
    isbn: "978-0743273565",
    communityRating: 3.9,
    userRating: 4,
    genre: "Classic Literature",
    pages: 180,
    dateFinished: "2023-05-20",
    type: "digital"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: { description: "A powerful story of racial injustice." },
    isbn: "978-0446310789",
    communityRating: 4.3,
    userRating: 5,
    genre: "Fiction",
    pages: 281,
    dateFinished: "2023-07-10",
    type: "audio"
  }
];

// Default story with good reading year
export const Default: Story = {
  args: {
    stats: {
      booksRead: 12,
      pagesRead: 3847,
      averageRating: 4.2,
      topBooks: mockBooks,
      favoriteGenre: "Science Fiction"
    },
  },
};

// Story with low reading activity
export const LowActivity: Story = {
  args: {
    stats: {
      booksRead: 3,
      pagesRead: 789,
      averageRating: 3.8,
      topBooks: mockBooks.slice(0, 2),
      favoriteGenre: "Classic Literature"
    },
  },
};

// Story with high reading activity
export const HighActivity: Story = {
  args: {
    stats: {
      booksRead: 25,
      pagesRead: 8750,
      averageRating: 4.5,
      topBooks: mockBooks,
      favoriteGenre: "Fiction"
    },
  },
};

// Story with no books read
export const NoBooksRead: Story = {
  args: {
    stats: {
      booksRead: 0,
      pagesRead: 0,
      averageRating: 0,
      topBooks: [],
      favoriteGenre: "None"
    },
  },
};

// Story with many top books
export const ManyTopBooks: Story = {
  args: {
    stats: {
      booksRead: 18,
      pagesRead: 6200,
      averageRating: 4.1,
      topBooks: [
        ...mockBooks,
        {
          title: "Pride and Prejudice",
          author: "Jane Austen",
          description: { description: "A classic romance novel." },
          isbn: "978-0141439518",
          communityRating: 4.1,
          userRating: 4,
          genre: "Romance",
          pages: 432,
          dateFinished: "2023-08-15",
          type: "paper"
        },
        {
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          description: { description: "A fantasy novel about Bilbo Baggins." },
          isbn: "978-0547928247",
          communityRating: 4.5,
          userRating: 5,
          genre: "Fantasy",
          pages: 366,
          dateFinished: "2023-09-20",
          type: "digital"
        }
      ],
      favoriteGenre: "Fantasy"
    },
  },
};

// Interactive story
export const Interactive: Story = {
  args: {
    stats: {
      booksRead: 8,
      pagesRead: 2450,
      averageRating: 4.0,
      topBooks: mockBooks,
      favoriteGenre: "Mystery"
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'This story allows you to interact with the component props to see how different values affect the display.',
      },
    },
  },
};
