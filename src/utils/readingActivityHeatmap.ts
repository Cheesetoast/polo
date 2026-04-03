/** YYYY-MM-DD in local time */
export function localDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

/** Sunday-start of the calendar week containing `d` (local). */
export function getSundayOfWeek(d: Date): Date {
  const x = startOfLocalDay(d)
  const day = x.getDay()
  x.setDate(x.getDate() - day)
  return x
}

export type HeatmapDayCell = {
  key: string
  count: number
  date: Date
  isFuture: boolean
}

/**
 * `weeksBack` full weeks from the week containing `today` (Sunday–Saturday columns).
 * Days after `today` within the last week are `isFuture` with count 0 for display.
 */
export function buildReadingHeatmapGrid(
  activityByDay: Record<string, number>,
  weeksBack: number,
  today: Date = new Date()
): { weeks: HeatmapDayCell[][]; maxCount: number; activeDaysInRange: number } {
  const end = startOfLocalDay(today)
  const endSunday = getSundayOfWeek(end)
  const gridStart = addDays(endSunday, -(weeksBack - 1) * 7)
  const gridEnd = addDays(endSunday, 6)

  const flat: HeatmapDayCell[] = []
  for (let cur = new Date(gridStart); cur <= gridEnd; cur = addDays(cur, 1)) {
    const isFuture = cur > end
    const key = localDateKey(cur)
    const count = isFuture ? 0 : activityByDay[key] ?? 0
    flat.push({ key, count, date: new Date(cur), isFuture })
  }

  const weeks: HeatmapDayCell[][] = []
  for (let i = 0; i < flat.length; i += 7) {
    weeks.push(flat.slice(i, i + 7))
  }

  let maxCount = 0
  let activeDaysInRange = 0
  for (const cell of flat) {
    if (cell.isFuture) continue
    if (cell.count > 0) activeDaysInRange++
    if (cell.count > maxCount) maxCount = cell.count
  }

  return { weeks, maxCount, activeDaysInRange }
}

export function intensityLevel(
  count: number,
  maxCount: number,
  isFuture: boolean
): 0 | 1 | 2 | 3 | 4 {
  if (isFuture || count <= 0) return 0
  if (maxCount <= 1) return 4
  const t = count / maxCount
  if (t <= 0.25) return 1
  if (t <= 0.5) return 2
  if (t <= 0.75) return 3
  return 4
}
