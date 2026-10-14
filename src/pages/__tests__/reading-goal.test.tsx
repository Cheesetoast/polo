import React from "react"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { navigate } from "gatsby"
import ReadingGoalPage from "../reading-goal"
import {
  DEFAULT_READING_GOAL,
  READING_GOAL_STORAGE_KEY,
} from "../../hooks/useReadingGoal"

jest.mock("@gatsbyjs/reach-router", () => ({
  useLocation: () => ({ pathname: "/reading-goal" }),
}))

describe("ReadingGoalPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    localStorage.clear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders the goal form, presets, and preview", async () => {
    render(<ReadingGoalPage />)

    expect(
      screen.getByRole("heading", { level: 1, name: "Reading goal" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: "Annual target" })
    ).toBeInTheDocument()
    expect(screen.getByText("Preview")).toBeInTheDocument()

    for (const preset of [12, 24, 36, 50, 75, 100]) {
      expect(
        screen.getByRole("button", { name: String(preset) })
      ).toBeInTheDocument()
    }

    await waitFor(() => {
      expect(screen.getByLabelText("Books this year")).toHaveValue(
        DEFAULT_READING_GOAL
      )
    })
  })

  it("updates the draft from a preset and saves the goal", async () => {
    render(<ReadingGoalPage />)

    await waitFor(() => {
      expect(screen.getByLabelText("Books this year")).toHaveValue(
        DEFAULT_READING_GOAL
      )
    })

    fireEvent.click(screen.getByRole("button", { name: "36" }))
    expect(screen.getByLabelText("Books this year")).toHaveValue(36)

    fireEvent.click(screen.getByRole("button", { name: "Save goal" }))

    expect(screen.getByRole("status")).toHaveTextContent("Goal saved")
    expect(localStorage.getItem(READING_GOAL_STORAGE_KEY)).toBe("36")

    act(() => {
      jest.advanceTimersByTime(1800)
    })
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })

  it("disables save when the draft is outside the allowed range", async () => {
    render(<ReadingGoalPage />)

    await waitFor(() => {
      expect(screen.getByLabelText("Books this year")).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText("Books this year"), {
      target: { value: "999" },
    })

    expect(screen.getByRole("button", { name: "Save goal" })).toBeDisabled()
  })

  it("navigates home from the back button", async () => {
    render(<ReadingGoalPage />)

    fireEvent.click(screen.getByRole("button", { name: "Back to home" }))
    expect(navigate).toHaveBeenCalledWith("/")
  })

  it("hydrates the input from a stored goal", async () => {
    localStorage.setItem(READING_GOAL_STORAGE_KEY, "75")
    render(<ReadingGoalPage />)

    await waitFor(() => {
      expect(screen.getByLabelText("Books this year")).toHaveValue(75)
    })
  })
})
