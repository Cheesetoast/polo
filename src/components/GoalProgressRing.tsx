import styled from "styled-components"
import { theme } from "../styles/theme"

type GoalProgressRingProps = {
  /** Book goal progress, 0–1 */
  progress: number
  /**
   * Fraction of the calendar year already elapsed, 0–1.
   * Drawn as a softer arc under the goal fill so remaining year is the empty track.
   */
  yearProgress?: number
  /** Calendar year shown at the bottom of the ring (e.g. 2026). */
  year?: number
  className?: string
  /** Unique gradient id when multiple rings render on one page. */
  gradientId?: string
}

const SIZE = 120
const STROKE = 10
/** Horseshoe arc (degrees). Gap at the bottom is `360 - ARC_DEGREES`. */
const ARC_DEGREES = 270
/**
 * Center the gap on 6 o'clock so left/right sides are symmetrical.
 * SVG strokes start at 3 o'clock; CSS/clock angles start at 12 o'clock.
 * visualStartFrom12 = 180 + (360 - ARC) / 2
 */
const ROTATE = 180 + (360 - ARC_DEGREES) / 2 - 90

function pointOnArc(progressAlongArc: number, tipR: number) {
  const center = SIZE / 2
  const p = Math.max(0, Math.min(1, progressAlongArc))
  const angleRad = ((ROTATE + p * ARC_DEGREES) * Math.PI) / 180
  return {
    x: center + tipR * Math.cos(angleRad),
    y: center + tipR * Math.sin(angleRad),
  }
}

/** 0–1 how far through the current calendar year we are. */
export function getYearProgress(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 1).getTime()
  const end = new Date(date.getFullYear() + 1, 0, 1).getTime()
  return Math.max(0, Math.min(1, (date.getTime() - start) / (end - start)))
}

/**
 * Horseshoe progress meter with rounded stroke caps.
 * Arc runs Jan → Dec; optional year fill shows elapsed time in the year.
 */
export function GoalProgressRing({
  progress,
  yearProgress,
  year = new Date().getFullYear(),
  className,
  gradientId = "goal-progress-grad",
}: GoalProgressRingProps) {
  const radius = (SIZE - STROKE) / 2
  const circumference = 2 * Math.PI * radius
  const arcLength = (ARC_DEGREES / 360) * circumference
  const bookFilled = Math.max(0, Math.min(1, progress)) * arcLength
  const yearFilled =
    yearProgress === undefined
      ? null
      : Math.max(0, Math.min(1, yearProgress)) * arcLength
  const center = SIZE / 2

  const labelR = radius + STROKE * 2.15
  const jan = pointOnArc(0, labelR)
  const dec = pointOnArc(1, labelR)
  const yearTip =
    yearFilled === null ? null : pointOnArc(yearProgress ?? 0, radius)

  return (
    <Svg
      className={className}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={`Reading goal progress across ${year}, January through December`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={theme.colors.coral} />
          <stop offset="100%" stopColor={theme.colors.accent} />
        </linearGradient>
      </defs>
      <g transform={`rotate(${ROTATE} ${center} ${center})`}>
        {/* Full year track — Jan → Dec */}
        <Arc
          cx={center}
          cy={center}
          r={radius}
          $dash={`${arcLength} ${circumference}`}
          stroke="rgba(255, 255, 255, 0.08)"
        />
        {/* Elapsed year */}
        {yearFilled !== null && (
          <Arc
            cx={center}
            cy={center}
            r={radius}
            $dash={`${yearFilled} ${circumference}`}
            stroke="rgba(255, 255, 255, 0.22)"
          />
        )}
        {/* Book goal progress */}
        <Arc
          cx={center}
          cy={center}
          r={radius}
          $dash={`${bookFilled} ${circumference}`}
          stroke={`url(#${gradientId})`}
        />
      </g>
      {yearTip && (
        <g>
          <title>Today in {year}</title>
          <TodayMark cx={yearTip.x} cy={yearTip.y} r={3.2} />
        </g>
      )}
      <EndpointLabel x={jan.x} y={jan.y} textAnchor="middle" dominantBaseline="middle">
        Jan
      </EndpointLabel>
      <EndpointLabel x={dec.x} y={dec.y} textAnchor="middle" dominantBaseline="middle">
        Dec
      </EndpointLabel>
      <YearLabel x={center} y={SIZE - 7} textAnchor="middle">
        {year}
      </YearLabel>
    </Svg>
  )
}

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
`

const Arc = styled.circle<{ $dash: string }>`
  fill: none;
  stroke-width: ${STROKE};
  stroke-linecap: round;
  stroke-dasharray: ${({ $dash }) => $dash};
  transition: stroke-dasharray 0.55s ease;
`

const TodayMark = styled.circle`
  fill: ${theme.colors.primary};
  stroke: ${theme.colors.background};
  stroke-width: 2;
`

const EndpointLabel = styled.text`
  fill: ${theme.colors.muted};
  font-size: 7.5px;
  font-weight: 700;
  font-family: ${theme.fontFamily};
  letter-spacing: 0.02em;
  pointer-events: none;
`

const YearLabel = styled.text`
  fill: ${theme.colors.secondary};
  font-size: 8.5px;
  font-weight: 700;
  font-family: ${theme.fontFamily};
  letter-spacing: 0.04em;
  pointer-events: none;
`

export default GoalProgressRing
