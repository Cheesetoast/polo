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
          "Homepage insights: catalog by length, catalog summary, tiles, and genre tags (genre mix panel toggled via HOMEPAGE_VIZ). Reading activity heatmap lives in the Bookshelf module (rating spread toggled the same way).",
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
  averageRating: "4.2",
  topGenres: ["Fiction", "Science Fiction", "Mystery"],
  genreChart: [
    { genre: "Fiction", count: 28 },
    { genre: "Science Fiction", count: 18 },
    { genre: "Mystery", count: 14 },
    { genre: "Horror", count: 11 },
    { genre: "Thriller", count: 9 },
  ],
  pageLengthChart: [
    { label: "Under 200 pp", count: 12 },
    { label: "200–399 pp", count: 38 },
    { label: "400–699 pp", count: 35 },
    { label: "700+ pp", count: 19 },
  ],
  ratingHistogram: [
    { stars: 1, count: 2 },
    { stars: 2, count: 5 },
    { stars: 3, count: 18 },
    { stars: 4, count: 42 },
    { stars: 5, count: 37 },
  ],
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
      averageRating: "N/A",
      topGenres: [],
      genreChart: [],
      pageLengthChart: [
        { label: "Under 200 pp", count: 0 },
        { label: "200–399 pp", count: 0 },
        { label: "400–699 pp", count: 0 },
        { label: "700+ pp", count: 0 },
      ],
      ratingHistogram: [
        { stars: 1, count: 0 },
        { stars: 2, count: 0 },
        { stars: 3, count: 0 },
        { stars: 4, count: 0 },
        { stars: 5, count: 0 },
      ],
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
      averageRating: "3.8",
      topGenres: ["Fiction", "Non-Fiction"],
      genreChart: [
        { genre: "Fiction", count: 2 },
        { genre: "Non-Fiction", count: 1 },
      ],
      pageLengthChart: [
        { label: "Under 200 pp", count: 0 },
        { label: "200–399 pp", count: 2 },
        { label: "400–699 pp", count: 1 },
        { label: "700+ pp", count: 0 },
      ],
      ratingHistogram: [
        { stars: 1, count: 0 },
        { stars: 2, count: 0 },
        { stars: 3, count: 1 },
        { stars: 4, count: 2 },
        { stars: 5, count: 0 },
      ],
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
