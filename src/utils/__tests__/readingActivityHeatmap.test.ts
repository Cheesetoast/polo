import {
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
})
