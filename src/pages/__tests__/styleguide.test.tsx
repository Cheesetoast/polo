import React from "react"
import { render, screen } from "@testing-library/react"
import StyleguidePage from "../styleguide"

jest.mock("@gatsbyjs/reach-router", () => ({
  useLocation: () => ({ pathname: "/styleguide" }),
}))

describe("StyleguidePage", () => {
  it("documents the dark dashboard theme tokens", () => {
    render(<StyleguidePage />)

    expect(
      screen.getByRole("heading", { level: 1, name: "Style guide" })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Plus Jakarta Sans, warm dark surfaces, gold accent/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Plus Jakarta Sans with Inter\/system fallbacks/i)
    ).toBeInTheDocument()
  })

  it("renders core token sections and button samples", () => {
    render(<StyleguidePage />)

    expect(screen.getByRole("heading", { name: "Typography" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Color" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Spacing" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Buttons" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Primary" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Secondary" })).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText("Default width (full in this column)")
    ).toBeInTheDocument()
  })
})
