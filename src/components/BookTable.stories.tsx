import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BookTable } from './BookTable';

const meta: Meta<typeof BookTable> = {
  title: 'Components/BookTable',
  component: BookTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    pageSize: {
      control: { type: 'number', min: 1, max: 50 },
      description: 'Number of books to show per page',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BookTable>;

const mockBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: { description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.' },
    isbn: '978-0743273565',
    communityRating: 4.2,
    userRating: 5,
    genre: 'Fiction',
    progress: 100,
    dateStarted: '2023-01-15',
    dateFinished: '2023-02-01',

    pages: 180,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: { description: 'The story of young Scout Finch and her father Atticus in a racially divided Alabama town.' },
    isbn: '978-0446310789',
    communityRating: 4.8,
    userRating: 4,
    genre: 'Fiction',
    progress: 75,
    dateStarted: '2023-03-10',
    dateFinished: null,

    pages: 281,
  },
  {
    title: '1984',
    author: 'George Orwell',
    description: { description: 'A dystopian novel about totalitarianism and surveillance society.' },
    isbn: '978-0451524935',
    communityRating: 4.5,
    userRating: undefined,
    genre: 'Science Fiction',
    progress: 0,
    dateStarted: null,
    dateFinished: null,

    pages: 328,
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: { description: 'A romantic novel of manners that follows the emotional development of Elizabeth Bennet.' },
    isbn: '978-0141439518',
    communityRating: 4.3,
    userRating: 4.5,
    genre: 'Romance',
    progress: 100,
    dateStarted: '2023-05-20',
    dateFinished: '2023-06-15',

    pages: 432,
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description: { description: 'A fantasy novel about Bilbo Baggins, a hobbit who embarks on a quest with a group of dwarves.' },
    isbn: '978-0547928241',
    communityRating: 4.6,
    userRating: undefined,
    genre: 'Fantasy',
    progress: 25,
    dateStarted: '2023-07-01',
    dateFinished: null,

    pages: 366,
  },
];

export const Default: Story = {
  args: {
    books: mockBooks,
  },
};

export const WithPagination: Story = {
  args: {
    books: mockBooks,
    pageSize: 3, // Smaller page size to show pagination
  },
};

export const WithClickHandler: Story = {
  args: {
    books: mockBooks,
    onBookClick: (book) => {
      console.log('Book clicked:', book.title);
      alert(`Clicked on: ${book.title}`);
    },
  },
};

export const EmptyState: Story = {
  args: {
    books: [],
  },
};

export const SingleBook: Story = {
  args: {
    books: [mockBooks[0]],
  },
};

export const ManyBooks: Story = {
  args: {
    books: [
      ...mockBooks,
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        description: { description: 'A novel about teenage alienation and loss of innocence.' },
        isbn: '978-0316769488',
        communityRating: 4.1,
        userRating: 3.5,
        genre: 'Fiction',
        progress: 100,
        dateStarted: '2023-08-10',
        dateFinished: '2023-08-25',
    
        pages: 277,
      },
      {
        title: 'Brave New World',
        author: 'Aldous Huxley',
        description: { description: 'A dystopian novel about a futuristic society.' },
        isbn: '978-0060850524',
        communityRating: 4.4,
        userRating: undefined,
        genre: 'Science Fiction',
        progress: 0,
        dateStarted: null,
        dateFinished: null,
    
        pages: 311,
      },
      {
        title: 'Lord of the Flies',
        author: 'William Golding',
        description: { description: 'A novel about a group of boys stranded on an island.' },
        isbn: '978-0571056866',
        communityRating: 4.2,
        userRating: 4.0,
        genre: 'Fiction',
        progress: 60,
        dateStarted: '2023-09-01',
        dateFinished: null,
    
        pages: 224,
      },
      {
        title: 'Fahrenheit 451',
        author: 'Ray Bradbury',
        description: { description: 'A dystopian novel about book burning.' },
        isbn: '978-1451673319',
        communityRating: 4.3,
        userRating: undefined,
        genre: 'Science Fiction',
        progress: 0,
        dateStarted: null,
        dateFinished: null,
    
        pages: 194,
      },
    ],
    pageSize: 5, // Show pagination with many books
  },
};

export const CustomPageSize: Story = {
  args: {
    books: mockBooks,
    pageSize: 2, // Very small page size
  },
};
