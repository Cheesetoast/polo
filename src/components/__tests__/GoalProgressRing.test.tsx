import React from "react"
import { render, screen } from "@testing-library/react"
import { GoalProgressRing, getYearProgress } from "../GoalProgressRing"

describe("getYearProgress", () => {
  it("returns ~0 at the start of the year", () => {
    expect(getYearProgress(new Date(2026, 0, 1, 0, 0, 0))).toBeCloseTo(0, 2)
  })

  it("returns ~1 at the end of the year", () => {
    expect(getYearProgress(new Date(2026, 11, 31, 23, 59, 59))).toBeCloseTo(
      1,
      2
    )
  })

  it("returns a mid-year fraction around July", () => {
    const mid = getYearProgress(new Date(2026, 6, 2, 12, 0, 0))
    expect(mid).toBeGreaterThan(0.45)
    expect(mid).toBeLessThan(0.55)
  })

  it("always returns a value between 0 and 1", () => {
    const samples = [
      new Date(2026, 0, 1),
      new Date(2026, 5, 15),
      new Date(2026, 11, 31, 23, 59, 59),
    ]
    for (const date of samples) {
      const value = getYearProgress(date)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThanOrEqual(1)
    }
  })
})

describe("GoalProgressRing", () => {
  it("renders accessible progress with Jan/Dec and year labels", () => {
    render(
      <GoalProgressRing progress={0.4} yearProgress={0.5} year={2026} />
    )

    expect(
      screen.getByRole("img", {
        name: "Reading goal progress across 2026, January through December",
      })
    ).toBeInTheDocument()
    expect(screen.getByText("Jan")).toBeInTheDocument()
    expect(screen.getByText("Dec")).toBeInTheDocument()
    expect(screen.getByText("2026")).toBeInTheDocument()
  })

  it("marks today when yearProgress is provided", () => {
    const { container } = render(
      <GoalProgressRing progress={0.2} yearProgress={0.3} year={2026} />
    )

    expect(container.querySelector("title")).toHaveTextContent("Today in 2026")
  })

  it("omits the today mark when yearProgress is omitted", () => {
    const { container } = render(<GoalProgressRing progress={0.5} year={2026} />)

    expect(container.querySelector("title")).toBeNull()
  })

  it("clamps progress values without throwing", () => {
    const { container } = render(
      <GoalProgressRing progress={2} yearProgress={-1} year={2026} />
    )

    expect(container.querySelector("svg")).toBeTruthy()
  })
})
