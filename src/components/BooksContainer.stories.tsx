import type { Meta, StoryObj } from '@storybook/react';
import { BooksContainer } from './BooksContainer';

const meta: Meta<typeof BooksContainer> = {
  title: 'Components/BooksContainer',
  component: BooksContainer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A simple container component that displays books in a horizontal flex layout.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    books: {
      description: 'Array of book objects to display',
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof BooksContainer>;

const mockBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: { description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.' },
    isbn: '978-0743273565',
    rating: 4,
    genre: 'Fiction',
    progress: 100,
    dateStarted: '2023-01-15',
    dateFinished: '2023-02-20',

  },
  {
    title: '1984',
    author: 'George Orwell',
    description: { description: 'A dystopian novel about totalitarianism and surveillance society.' },
    isbn: '978-0451524935',
    rating: 5,
    genre: 'Science Fiction',
    progress: 2,
    dateStarted: '2023-03-01',
    dateFinished: null,

  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: { description: 'A story of racial injustice and the loss of innocence in the American South.' },
    isbn: '978-0446310789',
    rating: 4,
    genre: 'Fiction',
    progress: 75,
    dateStarted: '2023-04-10',
    dateFinished: null,

  },
];

export const Default: Story = {
  args: {
    books: mockBooks,
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
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        description: { description: 'A romantic novel of manners.' },
        isbn: '978-0141439518',
        rating: 4,
        genre: 'Romance',
        progress: 0,
        dateStarted: null,
        dateFinished: null,
    
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        description: { description: 'A fantasy novel about a hobbit\'s journey.' },
        isbn: '978-0547928241',
        rating: 5,
        genre: 'Fantasy',
        progress: 50,
        dateStarted: '2023-05-01',
        dateFinished: null,
    
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Container with multiple books showing the horizontal layout.',
      },
    },
  },
};

export const EmptyContainer: Story = {
  args: {
    books: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Container with no books.',
      },
    },
  },
};
