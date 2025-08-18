import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BookBoard, BookWithReadingStatus } from './BookBoard';

const meta: Meta<typeof BookBoard> = {
  title: 'Components/BookBoard',
  component: BookBoard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A Kanban-style board component for organizing books by reading status.',
      },
    },
  },
  argTypes: {
    books: {
      description: 'Array of books with their reading status',
      control: { type: 'object' },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock book data with status
const mockBooksWithStatus: BookWithReadingStatus[] = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: {
      description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    },
    image: {
      gatsbyImageData: {
        images: {
          sources: [],
          fallback: {
            src: 'https://via.placeholder.com/300x400/4A5568/FFFFFF?text=Gatsby',
            srcSet: 'https://via.placeholder.com/300x400/4A5568/FFFFFF?text=Gatsby',
            sizes: '(max-width: 300px) 100vw, 300px',
          },
        },
        layout: 'constrained',
        width: 300,
        height: 400,
      },
      title: 'The Great Gatsby Cover',
    },
    isbn: '978-0743273565',
    status: 'want-to-read',
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: {
      description: 'The story of young Scout Finch and her father Atticus in a racially divided Alabama town.',
    },
    isbn: '978-0446310789',
    status: 'currently-reading',
  },
  {
    title: '1984',
    author: 'George Orwell',
    description: {
      description: 'A dystopian novel about totalitarian surveillance and control.',
    },
    image: {
      gatsbyImageData: {
        images: {
          sources: [],
          fallback: {
            src: 'https://via.placeholder.com/300x400/2D3748/FFFFFF?text=1984',
            srcSet: 'https://via.placeholder.com/300x400/2D3748/FFFFFF?text=1984',
            sizes: '(max-width: 300px) 100vw, 300px',
          },
        },
        layout: 'constrained',
        width: 300,
        height: 400,
      },
      title: '1984 Cover',
    },
    isbn: '978-0451524935',
    status: 'finished',
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: {
      description: 'The story follows the emotional development of Elizabeth Bennet, who learns about the repercussions of hasty judgments.',
    },
    image: {
      gatsbyImageData: {
        images: {
          sources: [],
          fallback: {
            src: 'https://via.placeholder.com/300x400/718096/FFFFFF?text=Pride+and+Prejudice',
            srcSet: 'https://via.placeholder.com/300x400/718096/FFFFFF?text=Pride+and+Prejudice',
            sizes: '(max-width: 300px) 100vw, 300px',
          },
        },
        layout: 'constrained',
        width: 300,
        height: 400,
      },
      title: 'Pride and Prejudice Cover',
    },
    isbn: '978-0141439518',
    status: 'finished',
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description: {
      description: 'A fantasy novel about the adventures of Bilbo Baggins, a hobbit who embarks on a quest.',
    },
    isbn: '978-0547928241',
    status: 'want-to-read',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    description: {
      description: 'A science fiction novel set in a distant future where noble houses control planetary fiefs.',
    },
    isbn: '978-0441172719',
    status: 'currently-reading',
  },
];

const emptyBooks: BookWithReadingStatus[] = [];

const singleColumnBooks: BookWithReadingStatus[] = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: {
      description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    },
    isbn: '978-0743273565',
    status: 'want-to-read',
  },
];

// Stories
export const Default: Story = {
  args: {
    books: mockBooksWithStatus,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default BookBoard with books. All books start in "Want to Read" by default. Click on books to cycle through statuses.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    books: emptyBooks,
  },
  parameters: {
    docs: {
      description: {
        story: 'BookBoard with no books, showing empty states for all columns.',
      },
    },
  },
};

export const SingleBook: Story = {
  args: {
    books: singleColumnBooks,
  },
  parameters: {
    docs: {
      description: {
        story: 'BookBoard with only one book. Books start in "Want to Read" by default.',
      },
    },
  },
};

export const ManyBooks: Story = {
  args: {
    books: [
      ...mockBooksWithStatus,
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        description: {
          description: 'A novel about teenage alienation and loss of innocence.',
        },
        isbn: '978-0316769488',
        status: 'want-to-read',
      },
      {
        title: 'Lord of the Flies',
        author: 'William Golding',
        description: {
          description: 'A novel about the dark side of human nature.',
        },
        isbn: '978-0399501487',
        status: 'currently-reading',
      },
      {
        title: 'Animal Farm',
        author: 'George Orwell',
        description: {
          description: 'An allegorical novella about the Russian Revolution.',
        },
        isbn: '978-0451526342',
        status: 'finished',
      },
      {
        title: 'Brave New World',
        author: 'Aldous Huxley',
        description: {
          description: 'A dystopian social science fiction novel.',
        },
        isbn: '978-0060850524',
        status: 'finished',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'BookBoard with many books across all columns.',
      },
    },
  },
};
