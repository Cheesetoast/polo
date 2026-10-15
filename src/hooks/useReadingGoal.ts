import { useCallback, useEffect, useState } from "react"

export const READING_GOAL_STORAGE_KEY = "polo-reading-goal"
export const DEFAULT_READING_GOAL = 10
export const MIN_READING_GOAL = 1
export const MAX_READING_GOAL = 500

function clampGoal(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_READING_GOAL
  return Math.min(MAX_READING_GOAL, Math.max(MIN_READING_GOAL, Math.round(value)))
}

function readStoredGoal(): number {
  if (typeof window === "undefined") return DEFAULT_READING_GOAL
  try {
    const raw = localStorage.getItem(READING_GOAL_STORAGE_KEY)
    if (!raw) return DEFAULT_READING_GOAL
    return clampGoal(Number(raw))
  } catch {
    return DEFAULT_READING_GOAL
  }
}

export function useReadingGoal() {
  const [goal, setGoalState] = useState(DEFAULT_READING_GOAL)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setGoalState(readStoredGoal())
    setReady(true)
  }, [])

  const setGoal = useCallback((next: number) => {
    const clamped = clampGoal(next)
    setGoalState(clamped)
    try {
      localStorage.setItem(READING_GOAL_STORAGE_KEY, String(clamped))
    } catch {
      /* private mode / quota */
    }
    return clamped
  }, [])

  return { goal, setGoal, ready, defaultGoal: DEFAULT_READING_GOAL }
}
