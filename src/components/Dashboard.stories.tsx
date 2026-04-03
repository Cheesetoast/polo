import type { Meta, StoryObj } from "@storybook/react"
import { Dashboard } from "./Dashboard"

const meta: Meta<typeof Dashboard> = {
  title: "Components/Dashboard",
  component: Dashboard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Homepage insights: catalog pages, top author, longest book, genres, and average rating.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    stats: {
      description: "Statistics data to display",
      control: { type: "object" },
    },
    className: {
      description: "Additional CSS class name",
      control: { type: "text" },
    },
    style: {
      description: "Additional inline styles",
      control: { type: "object" },
    },
  },
}

export default meta
type Story = StoryObj<typeof Dashboard>

const mockStats = {
  totalBooks: 104,
  topGenres: ["Fiction", "Science Fiction", "Mystery"],
  averageRating: "4.2",
  totalPages: 248_900,
  distinctGenreCount: 14,
  topAuthor: {
    name: "Stephen King",
    count: 18,
    authorId: "stephen-king",
  },
  longestBook: { title: "The Stand", pages: 1153 },
}

export const Default: Story = {
  args: {
    stats: mockStats,
  },
}

export const EmptyStats: Story = {
  args: {
    stats: {
      totalBooks: 0,
      topGenres: [],
      averageRating: "N/A",
      totalPages: 0,
      distinctGenreCount: 0,
      topAuthor: null,
      longestBook: null,
    },
  },
}

export const FewBooks: Story = {
  args: {
    stats: {
      totalBooks: 3,
      topGenres: ["Fiction", "Non-Fiction"],
      averageRating: "3.8",
      totalPages: 890,
      distinctGenreCount: 2,
      topAuthor: { name: "George Orwell", count: 2, authorId: "george-orwell" },
      longestBook: { title: "1984", pages: 328 },
    },
  },
}

export const AuthorWithoutProfileLink: Story = {
  args: {
    stats: {
      ...mockStats,
      topAuthor: { name: "Unknown Writer", count: 4 },
    },
  },
}

export const WithCustomStyling: Story = {
  args: {
    stats: mockStats,
    style: {
      backgroundColor: "#f8f9fa",
      border: "2px solid #e9ecef",
      borderRadius: "12px",
    },
  },
}

export const WithCustomClassName: Story = {
  args: {
    stats: mockStats,
    className: "custom-dashboard",
  },
  parameters: {
    docs: {
      description: {
        story: "Dashboard with a custom CSS class applied.",
      },
    },
  },
}
