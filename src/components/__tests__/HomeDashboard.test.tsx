import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { navigate } from "gatsby"
import { HomeDashboard } from "../HomeDashboard"
import {
  DEFAULT_READING_GOAL,
  READING_GOAL_STORAGE_KEY,
} from "../../hooks/useReadingGoal"

describe("HomeDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it("renders the welcome greeting with the site brand", () => {
    render(<HomeDashboard />)

    expect(screen.getByText(/Welcome back to/i)).toBeInTheDocument()
    expect(screen.getByText("Book Stack")).toBeInTheDocument()
  })

  it("uses an optional homepage title override", () => {
    render(<HomeDashboard homepageTitle="Custom Stack" />)

    expect(screen.getByText("Custom Stack")).toBeInTheDocument()
  })

  it("renders reading goal, book of the day, and shelf modules", async () => {
    render(<HomeDashboard />)

    const year = new Date().getFullYear()
    expect(
      screen.getByText(new RegExp(`${year} reading goal`))
    ).toBeInTheDocument()
    expect(screen.getByText("Edit goal")).toHaveAttribute(
      "href",
      "/reading-goal"
    )
    expect(
      screen.getByLabelText("Open reading goal settings")
    ).toHaveAttribute("href", "/reading-goal")

    expect(screen.getByText("Book of the day")).toBeInTheDocument()
    expect(screen.getByText("The Hobbit")).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "J.R.R. Tolkien" })
    ).toHaveAttribute("href", "/author/j-r-r-tolkien")

    expect(screen.getByText("Organize your reading")).toBeInTheDocument()
    expect(screen.getByText("Want to read")).toBeInTheDocument()
    expect(screen.getByText("Reading")).toBeInTheDocument()
    expect(screen.getByText("Finished")).toBeInTheDocument()
    expect(screen.getByText("Bestsellers")).toBeInTheDocument()
    expect(screen.getByText("Currently Reading")).toBeInTheDocument()
    expect(screen.getByText("Year so far")).toBeInTheDocument()
    expect(screen.getByText("Books finished")).toBeInTheDocument()

    await waitFor(() => {
      expect(
        screen.getByText(new RegExp(`/ ${DEFAULT_READING_GOAL}`))
      ).toBeInTheDocument()
    })
  })

  it("shows eight bestseller entries", () => {
    render(<HomeDashboard />)

    const opens = screen
      .getAllByRole("link")
      .filter(
        (link) =>
          link.getAttribute("href")?.startsWith("/book/") &&
          link.getAttribute("aria-label")?.startsWith("Open ")
      )
    expect(opens).toHaveLength(8)
  })

  it("navigates to search results from Discover books", () => {
    render(<HomeDashboard />)

    fireEvent.click(screen.getByRole("button", { name: "Discover books" }))
    expect(navigate).toHaveBeenCalledWith("/search-results")
  })

  it("submits the header search to search-results", () => {
    render(<HomeDashboard />)

    fireEvent.change(screen.getByLabelText("Search books"), {
      target: { value: "orwell" },
    })
    fireEvent.submit(screen.getByLabelText("Search books").closest("form")!)

    expect(navigate).toHaveBeenCalledWith("/search-results?search=orwell")
  })

  it("does not navigate on empty search submit", () => {
    render(<HomeDashboard />)

    fireEvent.submit(screen.getByLabelText("Search books").closest("form")!)
    expect(navigate).not.toHaveBeenCalled()
  })

  it("reflects a stored reading goal in the gauge", async () => {
    localStorage.setItem(READING_GOAL_STORAGE_KEY, "24")
    render(<HomeDashboard />)

    await waitFor(() => {
      expect(screen.getByText(/\/ 24/)).toBeInTheDocument()
    })
  })
})
