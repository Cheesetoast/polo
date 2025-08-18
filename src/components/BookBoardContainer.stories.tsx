import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BookBoardContainer } from './BookBoardContainer';

const meta: Meta<typeof BookBoardContainer> = {
  title: 'Components/BookBoardContainer',
  component: BookBoardContainer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A container component that wraps BookBoard with localStorage functionality. Use this when you want a complete book management system.',
      },
    },
  },
  argTypes: {
    books: {
      description: 'Array of books from Contentful',
      control: { type: 'object' },
    },
    title: {
      description: 'Title for the book board section',
      control: { type: 'text' },
    },
    showResetButton: {
      description: 'Whether to show the reset button',
      control: { type: 'boolean' },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock book data
const mockBooks = [
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
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: {
      description: 'The story of young Scout Finch and her father Atticus in a racially divided Alabama town.',
    },
    isbn: '978-0446310789',
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
  },
];

// Stories
export const Default: Story = {
  args: {
    books: mockBooks,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default BookBoardContainer with mock books. Books will start in "Want to Read" and can be moved between columns.',
      },
    },
  },
};

export const WithCustomTitle: Story = {
  args: {
    books: mockBooks,
    title: 'My Personal Library',
  },
  parameters: {
    docs: {
      description: {
        story: 'BookBoardContainer with a custom title.',
      },
    },
  },
};

export const WithoutResetButton: Story = {
  args: {
    books: mockBooks,
    showResetButton: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'BookBoardContainer without the reset button.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    books: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'BookBoardContainer with no books.',
      },
    },
  },
};

export const SingleBook: Story = {
  args: {
    books: [mockBooks[0]],
  },
  parameters: {
    docs: {
      description: {
        story: 'BookBoardContainer with only one book.',
      },
    },
  },
};
