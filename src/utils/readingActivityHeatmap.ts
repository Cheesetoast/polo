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

/** Deterministic PRNG so demo activity is stable across reloads. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Demo reading-activity history for empty localStorage.
 * Sparse weekdays, busier weekends/Tue–Thu, slightly denser recent weeks.
 */
/** Week columns shown on the heatmap (full year). */
export const READING_ACTIVITY_WEEKS = 53

/**
 * Merge a full-year demo seed under existing activity so older months are
 * filled without overwriting days the user (or prior seed) already logged.
 */
export function backfillReadingActivityByDay(
  existing: Record<string, number>,
  today: Date = new Date(),
  weeksBack = READING_ACTIVITY_WEEKS,
  seed = 20261015
): Record<string, number> {
  return {
    ...buildDefaultReadingActivityByDay(today, weeksBack, seed),
    ...existing,
  }
}

export function buildDefaultReadingActivityByDay(
  today: Date = new Date(),
  weeksBack = READING_ACTIVITY_WEEKS,
  seed = 20261015
): Record<string, number> {
  const rand = mulberry32(seed)
  const end = startOfLocalDay(today)
  const activity: Record<string, number> = {}

  for (let daysAgo = weeksBack * 7 - 1; daysAgo >= 0; daysAgo--) {
    const date = addDays(end, -daysAgo)
    if (date > end) continue

    const weekday = date.getDay()
    const weeksAgo = daysAgo / 7

    let chance = 0.2
    if (weekday === 0 || weekday === 6) chance = 0.48
    else if (weekday === 2 || weekday === 4) chance = 0.32
    else if (weekday === 1) chance = 0.14

    if (weeksAgo < 4) chance += 0.14
    else if (weeksAgo > 18) chance -= 0.08

    if (rand() > Math.max(0.05, Math.min(0.75, chance))) continue

    const roll = rand()
    let count = 1
    if (roll > 0.72) count = 2
    if (roll > 0.9) count = 3
    if (roll > 0.97) count = 4

    activity[localDateKey(date)] = count
  }

  return activity
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
