import type { Meta, StoryObj } from '@storybook/react';
import { BookBoard } from './BookBoard';
import { Book } from './Book';

const meta: Meta<typeof BookBoard> = {
  title: 'Components/BookBoard',
  component: BookBoard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample books for testing
const sampleBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: { description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.' },
    isbn: '978-0743273565',
    communityRating: 4.2,
    userRating: 4.5,
    genre: 'Fiction',
    progress: 100,
    dateStarted: '2023-01-15',
    dateFinished: '2023-02-15',
    pages: 180,
    status: 'finished' as const,
  },
  {
    title: '1984',
    author: 'George Orwell',
    description: { description: 'A dystopian novel about totalitarianism and surveillance society.' },
    isbn: '978-0451524935',
    communityRating: 4.5,
    userRating: 4.0,
    genre: 'Dystopian',
    progress: 75,
    dateStarted: '2023-03-01',
    dateFinished: null,
    pages: 328,
    status: 'currently-reading' as const,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: { description: 'A story of racial injustice and the loss of innocence in the American South.' },
    isbn: '978-0446310789',
    communityRating: 4.3,
    userRating: null,
    genre: 'Fiction',
    progress: 0,
    dateStarted: null,
    dateFinished: null,
    pages: 281,
    status: 'want-to-read' as const,
  },
];

export const Default: Story = {
  args: {
    books: sampleBooks,
    onBookStatusChange: (isbn: string, status: any) => {
      console.log(`Book ${isbn} status changed to ${status}`);
    },
  },
};

export const Empty: Story = {
  args: {
    books: [],
    onBookStatusChange: (isbn: string, status: any) => {
      console.log(`Book ${isbn} status changed to ${status}`);
    },
  },
};

export const WithManyBooks: Story = {
  args: {
    books: [
      ...sampleBooks,
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        description: { description: 'A romantic novel of manners that follows the emotional development of Elizabeth Bennet.' },
        isbn: '978-0141439518',
        communityRating: 4.2,
        userRating: null,
        genre: 'Romance',
        progress: 0,
        dateStarted: null,
        dateFinished: null,
        pages: 432,
        status: 'want-to-read' as const,
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        description: { description: 'A fantasy novel about a hobbit who embarks on an adventure with a group of dwarves.' },
        isbn: '978-0547928241',
        communityRating: 4.4,
        userRating: 5.0,
        genre: 'Fantasy',
        progress: 100,
        dateStarted: '2023-04-01',
        dateFinished: '2023-05-15',
        pages: 366,
        status: 'finished' as const,
      },
    ],
    onBookStatusChange: (isbn: string, status: any) => {
      console.log(`Book ${isbn} status changed to ${status}`);
    },
  },
};
