import React from "react"
import { render, screen } from "@testing-library/react"
import { Dashboard } from "../Dashboard"

const mockStats = {
  totalBooks: 25,
  topGenres: ["Fiction", "Non-Fiction", "Science Fiction"],
  averageRating: "4.2",
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
  })

  it("handles empty edge stats gracefully", () => {
    const emptyStats = {
      totalBooks: 0,
      topGenres: [],
      averageRating: "0.0",
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
