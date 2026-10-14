import React from "react"
import { render, screen } from "@testing-library/react"
import { AppSidebar } from "../AppSidebar"

const mockUseLocation = jest.fn()

jest.mock("@gatsbyjs/reach-router", () => ({
  useLocation: () => mockUseLocation(),
}))

describe("AppSidebar", () => {
  beforeEach(() => {
    mockUseLocation.mockReturnValue({ pathname: "/" })
  })

  it("renders primary navigation landmarks and labels", () => {
    render(<AppSidebar />)

    expect(screen.getByLabelText("Primary")).toBeInTheDocument()
    expect(screen.getByLabelText("Home")).toBeInTheDocument()
    expect(screen.getByLabelText("Browse")).toBeInTheDocument()
    expect(screen.getByLabelText("Bookshelf")).toBeInTheDocument()
    expect(screen.getByLabelText("Authors")).toBeInTheDocument()
    expect(screen.getByLabelText("Genres")).toBeInTheDocument()
    expect(screen.getByLabelText("Styleguide")).toBeInTheDocument()
  })

  it("links each icon to the expected route", () => {
    render(<AppSidebar />)

    expect(screen.getByLabelText("Home")).toHaveAttribute("href", "/")
    expect(screen.getByLabelText("Browse")).toHaveAttribute(
      "href",
      "/search-results"
    )
    expect(screen.getByLabelText("Bookshelf")).toHaveAttribute(
      "href",
      "/bookshelf"
    )
    expect(screen.getByLabelText("Authors")).toHaveAttribute("href", "/authors")
    expect(screen.getByLabelText("Genres")).toHaveAttribute("href", "/genres")
    expect(screen.getByLabelText("Styleguide")).toHaveAttribute(
      "href",
      "/styleguide"
    )
  })

  it("marks Home as current on the homepage", () => {
    mockUseLocation.mockReturnValue({ pathname: "/" })
    render(<AppSidebar />)

    expect(screen.getByLabelText("Home")).toHaveAttribute("aria-current", "page")
    expect(screen.getByLabelText("Browse")).not.toHaveAttribute("aria-current")
  })

  it("marks Browse as current on search and book routes", () => {
    mockUseLocation.mockReturnValue({ pathname: "/book/97801000000000" })
    const { rerender } = render(<AppSidebar />)

    expect(screen.getByLabelText("Browse")).toHaveAttribute(
      "aria-current",
      "page"
    )

    mockUseLocation.mockReturnValue({ pathname: "/search-results" })
    rerender(<AppSidebar />)
    expect(screen.getByLabelText("Browse")).toHaveAttribute(
      "aria-current",
      "page"
    )
  })

  it("marks Genres as current on genre detail routes", () => {
    mockUseLocation.mockReturnValue({ pathname: "/genre/Fiction" })
    render(<AppSidebar />)

    expect(screen.getByLabelText("Genres")).toHaveAttribute(
      "aria-current",
      "page"
    )
  })

  it("marks Styleguide as current on project routes", () => {
    mockUseLocation.mockReturnValue({ pathname: "/project" })
    render(<AppSidebar />)

    expect(screen.getByLabelText("Styleguide")).toHaveAttribute(
      "aria-current",
      "page"
    )
  })
})
