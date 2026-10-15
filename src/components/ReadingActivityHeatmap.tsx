import styled, { css, keyframes } from "styled-components"
import { theme } from "../styles/theme"
import { ModuleInsetPanel } from "./ModuleInsetPanel"
import {
  READING_ACTIVITY_WEEKS,
  buildReadingHeatmapGrid,
  intensityLevel,
} from "../utils/readingActivityHeatmap"

/** Full year of week columns so all 12 months can appear (GitHub-style). */
export const HEATMAP_WEEKS = READING_ACTIVITY_WEEKS

const CELL = 11
const GAP = 3

const cellFade = keyframes`
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const Root = styled(ModuleInsetPanel).attrs({
  $tone: "neutral" as const,
  $size: "well" as const,
})<{ $fillHeight?: boolean; $embedded?: boolean }>`
  margin: 0 0 ${theme.spacing.lg};
  min-width: 0;
  width: 100%;
  text-align: left;

  ${({ $embedded }) =>
    $embedded &&
    css`
      margin-bottom: 0;
    `}

  ${({ $fillHeight }) =>
    $fillHeight &&
    css`
      flex-shrink: 0;
    `}
`

const Title = styled.h3`
  margin: 0 0 ${theme.spacing.xs};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  line-height: ${theme.lineHeights.lg};
  letter-spacing: -0.02em;
  color: ${theme.colors.primary};
`

const Caption = styled.p`
  margin: 0 0 ${theme.spacing.md};
  font-size: ${theme.fontSizes.xs};
  line-height: ${theme.lineHeights.sm};
  color: ${theme.colors.muted};
`

const HeatmapOuter = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
  min-width: 0;
  width: 100%;
`

const WeekdayAxis = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  /* Align with grid cells under the month row */
  margin-top: 14px;
  height: calc(7 * ${CELL}px + 6 * ${GAP}px);
  font-size: 9px;
  line-height: 1;
  color: ${theme.colors.muted};
  text-align: right;
  width: 1.25rem;
  user-select: none;
`

const ScrollRegion = styled.div`
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: ${theme.spacing.xs};

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: ${theme.borderRadius.full};
  }
`

const GridStack = styled.div`
  width: max-content;
`

const MonthAxis = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${GAP}px;
  height: 12px;
  margin-bottom: 2px;
  font-size: 9px;
  line-height: 1;
  color: ${theme.colors.secondary};
  user-select: none;
`

const MonthTick = styled.span`
  display: block;
  width: ${CELL}px;
  flex-shrink: 0;
  overflow: visible;
  white-space: nowrap;
`

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${GAP}px;
  width: max-content;
  padding: 2px 0;
`

const WeekCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${GAP}px;
`

const Cell = styled.button<{
  $level: 0 | 1 | 2 | 3 | 4
  $muted: boolean
  $animDelay: number
}>`
  box-sizing: border-box;
  width: ${CELL}px;
  height: ${CELL}px;
  padding: 0;
  border: none;
  border-radius: 2px;
  cursor: default;
  flex-shrink: 0;
  transition: transform 0.12s ease, box-shadow 0.12s ease;

  ${({ $muted, $level, $animDelay }) => {
    if ($muted) {
      return css`
        background: rgba(15, 23, 42, 0.04);
        pointer-events: none;
      `
    }
    const base = "rgba(52, 199, 89,"
    const levels = [
      "rgba(15, 23, 42, 0.08)",
      `${base} 0.22)`,
      `${base} 0.42)`,
      `${base} 0.62)`,
      `${base} 0.9)`,
    ]
    return css`
      background: ${levels[$level]};
      animation: ${cellFade} 0.35s ease backwards;
      animation-delay: ${$animDelay}ms;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }

      &:hover:not(:disabled) {
        transform: scale(1.15);
        box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.12);
        z-index: 1;
      }
    `
  }}

  &:focus-visible {
    outline: 2px solid ${theme.colors.blue[500]};
    outline-offset: 1px;
  }
`

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.spacing.xs};
  margin-top: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.muted};
`

const SummaryLine = styled.p`
  margin: ${theme.spacing.sm} 0 0;
  font-size: ${theme.fontSizes.xs};
  line-height: ${theme.lineHeights.sm};
  color: ${theme.colors.muted};
`

const LegendSamples = styled.span`
  display: inline-flex;
  gap: 3px;
  align-items: center;
`

const LegendSwatch = styled.span<{ $level: 0 | 1 | 2 | 3 | 4 }>`
  width: ${CELL}px;
  height: ${CELL}px;
  border-radius: 2px;
  ${({ $level }) => {
    const base = "rgba(52, 199, 89,"
    const levels = [
      "rgba(15, 23, 42, 0.08)",
      `${base} 0.22)`,
      `${base} 0.42)`,
      `${base} 0.62)`,
      `${base} 0.9)`,
    ]
    return css`
      background: ${levels[$level]};
    `
  }}
`

const WEEKDAY_SHORT = ["S", "M", "T", "W", "T", "F", "S"] as const

function formatTooltipDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/** Label the first week column of each month (GitHub-style). */
function monthTickLabel(
  week: { date: Date }[],
  prevMonth: number | null
): string {
  const date = week[0]?.date
  if (!date) return ""
  const month = date.getMonth()
  if (prevMonth !== null && month === prevMonth) return ""
  return date.toLocaleDateString(undefined, { month: "short" })
}

export interface ReadingActivityHeatmapProps {
  activityByDay: Record<string, number>
  fillHeight?: boolean
  /** Last item in a stacked module: drop outer bottom margin (parent handles gap). */
  embedded?: boolean
  className?: string
}

export function ReadingActivityHeatmap({
  activityByDay,
  fillHeight = false,
  embedded = false,
  className,
}: ReadingActivityHeatmapProps) {
  const { weeks, maxCount, activeDaysInRange } = buildReadingHeatmapGrid(
    activityByDay,
    HEATMAP_WEEKS
  )

  const summary =
    activeDaysInRange === 0
      ? "No logged activity in this window yet."
      : `${activeDaysInRange} active day${
          activeDaysInRange === 1 ? "" : "s"
        } in the last year.`

  return (
    <Root
      className={className}
      $fillHeight={fillHeight}
      $embedded={embedded}
      role="region"
      aria-label="Reading activity by day"
    >
      <Title>Reading activity</Title>
      <Caption>
        Each square is a day over the past year; darker green means more shelf
        updates that day (status, progress, or your rating). Scroll sideways on
        smaller screens. Stored only in this browser.
      </Caption>
      <HeatmapOuter>
        <WeekdayAxis aria-hidden>
          {WEEKDAY_SHORT.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </WeekdayAxis>
        <ScrollRegion>
          <GridStack>
            <MonthAxis aria-hidden>
              {weeks.map((column, wi) => {
                const prevMonth =
                  wi > 0 ? weeks[wi - 1][0]?.date.getMonth() ?? null : null
                return (
                  <MonthTick key={`${column[0]?.key}-month`}>
                    {monthTickLabel(column, prevMonth)}
                  </MonthTick>
                )
              })}
            </MonthAxis>
            <Grid role="presentation">
              {weeks.map((column, wi) => (
                <WeekCol
                  key={`${column[0]?.key}-${wi}`}
                  role="presentation"
                  aria-label={`Week of ${formatTooltipDate(column[0].date)}`}
                >
                  {column.map((cell, di) => {
                    const level = intensityLevel(
                      cell.count,
                      maxCount,
                      cell.isFuture
                    )
                    const label = cell.isFuture
                      ? `${formatTooltipDate(cell.date)} — future`
                      : cell.count === 0
                        ? `${formatTooltipDate(cell.date)} — no activity`
                        : `${formatTooltipDate(cell.date)} — ${cell.count} update${
                            cell.count === 1 ? "" : "s"
                          }`
                    return (
                      <Cell
                        key={cell.key}
                        type="button"
                        disabled={cell.isFuture}
                        $muted={cell.isFuture}
                        $level={level}
                        $animDelay={wi * 8 + di * 2}
                        title={label}
                        aria-label={label}
                      />
                    )
                  })}
                </WeekCol>
              ))}
            </Grid>
          </GridStack>
        </ScrollRegion>
      </HeatmapOuter>
      <LegendRow>
        <span>Less</span>
        <LegendSamples aria-hidden>
          {([0, 1, 2, 3, 4] as const).map((lv) => (
            <LegendSwatch key={lv} $level={lv} />
          ))}
        </LegendSamples>
        <span>More</span>
      </LegendRow>
      <SummaryLine>{summary}</SummaryLine>
    </Root>
  )
}
