import {
  backfillReadingActivityByDay,
  buildDefaultReadingActivityByDay,
  buildReadingHeatmapGrid,
  getSundayOfWeek,
  intensityLevel,
  localDateKey,
} from "../readingActivityHeatmap"

describe("readingActivityHeatmap", () => {
  it("localDateKey formats local calendar date", () => {
    expect(localDateKey(new Date(2026, 3, 3))).toBe("2026-04-03")
  })

  it("getSundayOfWeek returns Sunday at midnight", () => {
    const fri = new Date(2026, 3, 3)
    const sun = getSundayOfWeek(fri)
    expect(sun.getDay()).toBe(0)
    expect(localDateKey(sun)).toBe("2026-03-29")
  })

  it("buildReadingHeatmapGrid returns fixed week columns", () => {
    const { weeks, maxCount, activeDaysInRange } = buildReadingHeatmapGrid(
      { "2026-04-03": 2 },
      2,
      new Date(2026, 3, 3)
    )
    expect(weeks).toHaveLength(2)
    expect(weeks[0]).toHaveLength(7)
    expect(maxCount).toBe(2)
    expect(activeDaysInRange).toBe(1)
  })

  it("intensityLevel respects future days", () => {
    expect(intensityLevel(3, 10, true)).toBe(0)
    expect(intensityLevel(0, 10, false)).toBe(0)
  })

  it("buildDefaultReadingActivityByDay creates a realistic sparse history", () => {
    const today = new Date(2026, 9, 15)
    const activity = buildDefaultReadingActivityByDay(today, 53, 20261015)
    const keys = Object.keys(activity)

    expect(keys.length).toBeGreaterThan(40)
    expect(keys.length).toBeLessThan(220)

    for (const count of Object.values(activity)) {
      expect(count).toBeGreaterThanOrEqual(1)
      expect(count).toBeLessThanOrEqual(4)
    }

    // Same seed → same pattern
    expect(buildDefaultReadingActivityByDay(today, 53, 20261015)).toEqual(
      activity
    )
  })

  it("buildReadingHeatmapGrid with 53 weeks spans twelve months", () => {
    const today = new Date(2026, 9, 15)
    const { weeks } = buildReadingHeatmapGrid({}, 53, today)
    expect(weeks).toHaveLength(53)

    const months = new Set<number>()
    for (const week of weeks) {
      months.add(week[0].date.getMonth())
    }
    expect(months.size).toBe(12)
  })

  it("backfillReadingActivityByDay fills gaps without overwriting existing days", () => {
    const today = new Date(2026, 9, 15)
    const existing = { "2026-10-15": 9 }
    const merged = backfillReadingActivityByDay(existing, today, 53, 20261015)

    expect(merged["2026-10-15"]).toBe(9)
    expect(Object.keys(merged).length).toBeGreaterThan(
      Object.keys(existing).length
    )
  })
})
