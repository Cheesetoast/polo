import type { Meta, StoryObj } from '@storybook/react';
import BookshelfPage from '../pages/bookshelf';

// Mock Gatsby's navigate function
const mockNavigate = jest.fn();

// Mock the useBookStatus hook
jest.mock('../hooks/useBookStatus', () => ({
  useBookStatus: () => ({
    booksWithStatus: [
      {
        title: "1984",
        author: "George Orwell",
        description: { description: "A dystopian social science fiction novel and cautionary tale about totalitarianism, surveillance, and the manipulation of truth." },
        isbn: "978-0451524935",
        image: null,
        communityRating: 4.2,
        userRating: 5,
        genre: "Philosophy",
        progress: 100,
        dateStarted: "2025-05-19",
        dateFinished: "2025-05-29",
        pages: 328,
        status: "finished"
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: { description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, exploring themes of decadence, idealism, and the American Dream." },
        isbn: "978-0743273565",
        image: null,
        communityRating: 3.9,
        genre: "Adventure",
        progress: 45,
        dateStarted: "2023-12-25",
        dateFinished: null,
        pages: 180,
        status: "currently-reading"
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        description: { description: "A powerful story of racial injustice and the loss of innocence in the American South, told through the eyes of young Scout Finch." },
        isbn: "978-0446310789",
        image: null,
        communityRating: 4.3,
        userRating: 4,
        genre: "Fiction",
        progress: 0,
        dateStarted: "2023-01-02",
        dateFinished: null,
        pages: 281,
        status: "want-to-read"
      }
    ],
    updateBookStatus: jest.fn(),
    resetStatuses: jest.fn(),
    clearLocalStorage: jest.fn()
  })
}));

// Mock Gatsby components
jest.mock('gatsby', () => ({
  navigate: mockNavigate
}));

jest.mock('./Layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>
}));

jest.mock('./ContentWrapper', () => ({
  ContentWrapper: ({ children }: { children: React.ReactNode }) => <div data-testid="content-wrapper">{children}</div>
}));

jest.mock('./Text', () => ({
  Text: ({ children, variant, ...props }: any) => {
    const Tag = variant === 'h1' ? 'h1' : variant === 'h2' ? 'h2' : variant === 'h3' ? 'h3' : 'p';
    return <Tag {...props}>{children}</Tag>;
  }
}));

jest.mock('./Button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  )
}));

jest.mock('./BookBoard', () => ({
  BookBoard: ({ books, onBookStatusChange }: any) => (
    <div data-testid="book-board">
      <h3>Book Board Component</h3>
      <p>Books: {books.length}</p>
      <button onClick={() => onBookStatusChange && onBookStatusChange('978-0451524935', 'currently-reading')}>
        Change Status
      </button>
    </div>
  )
}));

const meta: Meta<typeof BookshelfPage> = {
  title: 'Pages/Bookshelf',
  component: BookshelfPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const EmptyBookshelf: Story = {
  args: {},
  parameters: {
    mockData: {
      useBookStatus: () => ({
        booksWithStatus: [],
        updateBookStatus: jest.fn(),
        resetStatuses: jest.fn(),
        clearLocalStorage: jest.fn()
      })
    }
  }
};

export const ManyBooks: Story = {
  args: {},
  parameters: {
    mockData: {
      useBookStatus: () => ({
        booksWithStatus: Array.from({ length: 20 }, (_, i) => ({
          title: `Book ${i + 1}`,
          author: `Author ${i + 1}`,
          description: { description: `Description for book ${i + 1}` },
          isbn: `978-000000000${i}`,
          image: null,
          communityRating: 4.0 + (i % 5) * 0.2,
          userRating: 3 + (i % 3),
          genre: ["Fiction", "Non-Fiction", "Science Fiction", "Mystery"][i % 4],
          progress: (i % 3) * 50,
          dateStarted: "2023-01-01",
          dateFinished: i % 4 === 0 ? "2023-12-31" : null,
          pages: 200 + (i * 50),
          status: ["want-to-read", "currently-reading", "finished"][i % 3]
        })),
        updateBookStatus: jest.fn(),
        resetStatuses: jest.fn(),
        clearLocalStorage: jest.fn()
      })
    }
  }
};
