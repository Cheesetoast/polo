import { renderHook, act, waitFor } from "@testing-library/react"
import {
  DEFAULT_READING_GOAL,
  MAX_READING_GOAL,
  MIN_READING_GOAL,
  READING_GOAL_STORAGE_KEY,
  useReadingGoal,
} from "../useReadingGoal"

describe("useReadingGoal", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("starts at the default goal and becomes ready after hydration", async () => {
    const { result } = renderHook(() => useReadingGoal())

    expect(result.current.goal).toBe(DEFAULT_READING_GOAL)
    expect(result.current.defaultGoal).toBe(DEFAULT_READING_GOAL)

    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.goal).toBe(DEFAULT_READING_GOAL)
  })

  it("hydrates a stored goal from localStorage", async () => {
    localStorage.setItem(READING_GOAL_STORAGE_KEY, "75")

    const { result } = renderHook(() => useReadingGoal())

    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.goal).toBe(75)
  })

  it("persists setGoal values to localStorage", async () => {
    const { result } = renderHook(() => useReadingGoal())
    await waitFor(() => expect(result.current.ready).toBe(true))

    act(() => {
      expect(result.current.setGoal(36)).toBe(36)
    })

    expect(result.current.goal).toBe(36)
    expect(localStorage.getItem(READING_GOAL_STORAGE_KEY)).toBe("36")
  })

  it("clamps goals to the allowed range", async () => {
    const { result } = renderHook(() => useReadingGoal())
    await waitFor(() => expect(result.current.ready).toBe(true))

    act(() => {
      result.current.setGoal(0)
    })
    expect(result.current.goal).toBe(MIN_READING_GOAL)

    act(() => {
      result.current.setGoal(MAX_READING_GOAL + 50)
    })
    expect(result.current.goal).toBe(MAX_READING_GOAL)
  })

  it("falls back to the default for non-numeric stored values", async () => {
    localStorage.setItem(READING_GOAL_STORAGE_KEY, "not-a-number")

    const { result } = renderHook(() => useReadingGoal())

    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.goal).toBe(DEFAULT_READING_GOAL)
  })

  it("rounds fractional goals", async () => {
    const { result } = renderHook(() => useReadingGoal())
    await waitFor(() => expect(result.current.ready).toBe(true))

    act(() => {
      result.current.setGoal(24.6)
    })

    expect(result.current.goal).toBe(25)
  })
})
