import styled from "styled-components"
import { HOMEPAGE_VIZ } from "../constants"
import { theme } from "../styles/theme"
import { ModuleInsetPanel } from "./ModuleInsetPanel"
import { InsightBarRows } from "./InsightChartBars"
import { ReadingActivityHeatmap } from "./ReadingActivityHeatmap"

export interface BookshelfVizPanelsProps {
  ratingHistogram: { stars: number; count: number }[]
  activityByDay: Record<string, number>
}

const BookshelfChartPanel = styled(ModuleInsetPanel).attrs({
  $tone: "neutral" as const,
  $size: "well" as const,
})`
  min-width: 0;
  width: 100%;
  text-align: left;
`

const ChartTitle = styled.h3`
  margin: 0 0 ${theme.spacing.xs};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  line-height: ${theme.lineHeights.lg};
  letter-spacing: -0.02em;
  color: ${theme.colors.primary};
`

const ChartCaption = styled.p`
  margin: 0 0 ${theme.spacing.md};
  font-size: ${theme.fontSizes.xs};
  line-height: ${theme.lineHeights.sm};
  color: ${theme.colors.muted};
`

const BookshelfChartsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  min-width: 0;
  width: 100%;
`

export function BookshelfVizPanels({
  ratingHistogram,
  activityByDay,
}: BookshelfVizPanelsProps) {
  const showRatingSpread = ratingHistogram.some((h) => h.count > 0)

  return (
    <BookshelfChartsStack>
      {HOMEPAGE_VIZ.SHOW_RATING_SPREAD && showRatingSpread ? (
        <BookshelfChartPanel
          role="region"
          aria-label="Distribution of rounded community or user ratings"
        >
          <ChartTitle>Rating spread</ChartTitle>
          <ChartCaption>
            Books counted by rounded star rating (your rating when set, otherwise
            community).
          </ChartCaption>
          <InsightBarRows
            barPalette="amber"
            items={ratingHistogram.map((row) => ({
              key: String(row.stars),
              label: `${row.stars} star${row.stars === 1 ? "" : "s"}`,
              count: row.count,
            }))}
            ariaDescribe={(label, count) =>
              `${label}: ${count} ${count === 1 ? "book" : "books"}`
            }
          />
        </BookshelfChartPanel>
      ) : null}

      <ReadingActivityHeatmap activityByDay={activityByDay} embedded />
    </BookshelfChartsStack>
  )
}
