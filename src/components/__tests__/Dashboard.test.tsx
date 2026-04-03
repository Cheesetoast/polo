import React from "react"
import { render, screen } from "@testing-library/react"
import { Dashboard } from "../Dashboard"

const mockStats = {
  totalBooks: 25,
  averageRating: "4.2",
  topGenres: ["Fiction", "Non-Fiction", "Science Fiction"],
  genreChart: [
    { genre: "Fiction", count: 12 },
    { genre: "Non-Fiction", count: 8 },
    { genre: "Science Fiction", count: 5 },
  ],
  pageLengthChart: [
    { label: "Under 200 pp", count: 3 },
    { label: "200–399 pp", count: 10 },
    { label: "400–699 pp", count: 8 },
    { label: "700+ pp", count: 4 },
  ],
  ratingHistogram: [
    { stars: 1, count: 0 },
    { stars: 2, count: 1 },
    { stars: 3, count: 4 },
    { stars: 4, count: 12 },
    { stars: 5, count: 8 },
  ],
  totalPages: 12_400,
  distinctGenreCount: 8,
  topAuthor: {
    name: "Jane Austen",
    count: 6,
    authorId: "jane-austen",
  },
  longestBook: { title: "War and Peace", pages: 1225 },
}

describe("Dashboard Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Dashboard stats={mockStats} />)
    expect(container.firstChild).toBeTruthy()
  })

  it("shows library insights and genres", () => {
    render(<Dashboard stats={mockStats} />)
    expect(screen.getByText("Library by the numbers")).toBeInTheDocument()
    expect(screen.getByText("12,400")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Jane Austen" })).toHaveAttribute(
      "href",
      "/author/jane-austen"
    )
    expect(screen.getByText("War and Peace")).toBeInTheDocument()
    expect(screen.getByText("8 distinct genres")).toBeInTheDocument()
    expect(screen.getByText("Genre mix")).toBeInTheDocument()
    expect(screen.getByText("Catalog by length")).toBeInTheDocument()
  })

  it("handles empty edge stats gracefully", () => {
    const emptyStats = {
      totalBooks: 0,
      averageRating: "0.0",
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
    }
    const { container } = render(<Dashboard stats={emptyStats} />)
    expect(container.firstChild).toBeTruthy()
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(1)
  })
})
