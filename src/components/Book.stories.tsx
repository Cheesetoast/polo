import type { Meta, StoryObj } from '@storybook/react';
import { Book } from './Book';

const meta: Meta<typeof Book> = {
  title: 'Components/Book',
  component: Book,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Book component that displays book information including title, author, description, cover image, and ISBN.',
      },
    },
  },
  argTypes: {
    book: {
      description: 'Book data object containing all book information',
      control: { type: 'object' },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock book data for stories
const mockBookWithImage = {
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
          src: 'https://via.placeholder.com/300x400/4A5568/FFFFFF?text=Book+Cover',
          srcSet: 'https://via.placeholder.com/300x400/4A5568/FFFFFF?text=Book+Cover',
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
};

const mockBookWithoutImage = {
  title: 'To Kill a Mockingbird',
  author: 'Harper Lee',
  description: {
    description: 'The story of young Scout Finch and her father Atticus in a racially divided Alabama town.',
  },
  isbn: '978-0446310789',
};

const mockBookWithoutDescription = {
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
};

const mockBookWithoutISBN = {
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
};

// Stories
export const Default: Story = {
  args: {
    book: mockBookWithImage,
  },
};

export const WithoutImage: Story = {
  args: {
    book: mockBookWithoutImage,
  },
  parameters: {
    docs: {
      description: {
        story: 'Book component without a cover image. Shows how the component handles missing image data.',
      },
    },
  },
};

export const WithoutDescription: Story = {
  args: {
    book: mockBookWithoutDescription,
  },
  parameters: {
    docs: {
      description: {
        story: 'Book component without a description. Shows how the component handles missing description data.',
      },
    },
  },
};

export const WithoutISBN: Story = {
  args: {
    book: mockBookWithoutISBN,
  },
  parameters: {
    docs: {
      description: {
        story: 'Book component without an ISBN. Shows how the component handles missing ISBN data.',
      },
    },
  },
};

export const MinimalData: Story = {
  args: {
    book: {
      title: 'Untitled Book',
      author: 'Unknown Author',
      description: {
        description: '',
      },
      isbn: '978-0000000000',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Book component with minimal data. Shows the component with only required fields.',
      },
    },
  },
};

export const LongTitle: Story = {
  args: {
    book: {
      ...mockBookWithImage,
      title: 'The Very Long and Complicated Title of This Amazing Book That Goes On and On',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Book component with a very long title to test text wrapping and layout.',
      },
    },
  },
};

export const LongDescription: Story = {
  args: {
    book: {
      ...mockBookWithImage,
      description: {
        description: 'This is a very long description that goes on and on to test how the Book component handles lengthy text content. It should wrap properly and maintain good readability while fitting within the card layout.',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Book component with a long description to test text wrapping and layout.',
      },
    },
  },
};
