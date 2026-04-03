import styled, { css } from "styled-components"
import { rgba, theme } from "../styles/theme"

export const GenreChartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  min-width: 0;
`

export const GenreChartRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 5.75rem) minmax(0, 1fr) auto;
  gap: ${theme.spacing.sm};
  align-items: center;
  min-width: 0;

  @media (min-width: 480px) {
    grid-template-columns: minmax(0, 7.5rem) minmax(0, 1fr) 2.25rem;
  }
`

export const GenreChartLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.secondary};
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const GenreChartTrack = styled.div`
  height: 10px;
  border-radius: ${theme.borderRadius.full};
  background: rgba(15, 23, 42, 0.06);
  overflow: hidden;
  min-width: 0;
`

export const GenreChartValue = styled.span`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  font-variant-numeric: tabular-nums;
  color: ${theme.colors.primary};
  line-height: 1;
  justify-self: end;
`

const MiniChartBar = styled.div<{
  $palette: "indigo" | "slate" | "amber"
  $index: number
}>`
  height: 100%;
  min-width: 3px;
  border-radius: ${theme.borderRadius.full};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
  transition: width 0.55s cubic-bezier(0.22, 1, 0.36, 1);

  ${({ $palette, $index }) => {
    if ($palette === "amber") {
      const t = $index / 4
      return css`
        background: linear-gradient(
          90deg,
          rgba(255, 149, 0, ${0.32 + t * 0.12}) 0%,
          rgba(255, 149, 0, ${0.58 + t * 0.12}) 100%
        );
      `
    }
    if ($palette === "slate") {
      const t = ($index % 5) / 4
      return css`
        background: linear-gradient(
          90deg,
          rgba(100, 116, 139, ${0.38 + t * 0.1}) 0%,
          rgba(51, 65, 85, ${0.5 + t * 0.12}) 100%
        );
      `
    }
    const t = ($index % 6) / 5
    const a0 = 0.22 + t * 0.18
    const a1 = 0.38 + t * 0.2
    return css`
      background: linear-gradient(
        90deg,
        ${rgba.indigo(a0)} 0%,
        ${rgba.indigo(a1)} 100%
      );
    `
  }}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export function InsightBarRows({
  items,
  ariaDescribe,
  barPalette,
}: {
  items: { key: string; label: string; count: number }[]
  ariaDescribe: (label: string, count: number) => string
  barPalette: "indigo" | "slate" | "amber"
}) {
  const max = Math.max(...items.map((i) => i.count), 1)
  return (
    <GenreChartList role="list">
      {items.map(({ key, label, count }, index) => (
        <GenreChartRow
          key={key}
          role="listitem"
          aria-label={ariaDescribe(label, count)}
        >
          <GenreChartLabel title={label}>{label}</GenreChartLabel>
          <GenreChartTrack aria-hidden>
            <MiniChartBar
              $palette={barPalette}
              $index={index}
              style={{ width: `${(count / max) * 100}%` }}
            />
          </GenreChartTrack>
          <GenreChartValue aria-hidden>{count}</GenreChartValue>
        </GenreChartRow>
      ))}
    </GenreChartList>
  )
}
