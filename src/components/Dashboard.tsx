import styled, { css } from "styled-components"
import { Link } from "gatsby"
import { rgba, theme } from "../styles/theme"
import { dashboardShell } from "../styles/surfaceStyles"
import { ModuleInsetPanel } from "./ModuleInsetPanel"
import { Text } from "./Text"
import { Eyebrow } from "./Eyebrow"
import { GenreLink } from "./GenreLink"
import {
  InsightBarRows,
  GenreChartList,
  GenreChartRow,
  GenreChartLabel,
  GenreChartTrack,
  GenreChartValue,
} from "./InsightChartBars"

export interface DashboardStats {
  totalBooks: number
  averageRating: string
  topGenres: string[]
  /** Top genres by book count; powers the insights bar chart. */
  genreChart: { genre: string; count: number }[]
  totalPages: number
  distinctGenreCount: number
  topAuthor: {
    name: string
    count: number
    authorId?: string
  } | null
  longestBook: { title: string; pages: number } | null
  pageLengthChart: { label: string; count: number }[]
  ratingHistogram: { stars: number; count: number }[]
}

interface DashboardProps {
  stats: DashboardStats
  /** Stretch to fill a grid/flex column (homepage module layout). */
  fillHeight?: boolean
  className?: string
  style?: Record<string, any>
}

export const Dashboard = ({
  stats,
  fillHeight = false,
  className,
  style,
}: DashboardProps) => {
  return (
    <DashboardContainer
      $fillHeight={fillHeight}
      className={className}
      style={style}
    >
      <Eyebrow variant="neutral">Insights</Eyebrow>
      <DashboardTitle variant="h2">Library by the numbers</DashboardTitle>

      <InsightsGrid>
        <InsightCell>
          <InsightKicker>Pages in catalog</InsightKicker>
          <PagesInsightValue>
            {stats.totalPages > 0
              ? stats.totalPages.toLocaleString()
              : "—"}
          </PagesInsightValue>
        </InsightCell>

        <InsightCell>
          <InsightKicker>Top author</InsightKicker>
          {stats.topAuthor ? (
            <>
              {stats.topAuthor.authorId ? (
                <InsightAuthorLink to={`/author/${stats.topAuthor.authorId}`}>
                  {stats.topAuthor.name}
                </InsightAuthorLink>
              ) : (
                <InsightEmphasis>{stats.topAuthor.name}</InsightEmphasis>
              )}
              <InsightMeta>
                {stats.topAuthor.count}{" "}
                {stats.topAuthor.count === 1 ? "book" : "books"}
              </InsightMeta>
            </>
          ) : (
            <Text variant="p" color="secondary">
              —
            </Text>
          )}
        </InsightCell>

        <InsightCell>
          <InsightKicker>Longest book</InsightKicker>
          {stats.longestBook ? (
            <>
              <InsightEmphasis>{stats.longestBook.title}</InsightEmphasis>
              <InsightMeta>
                {stats.longestBook.pages.toLocaleString()} pages
              </InsightMeta>
            </>
          ) : (
            <Text variant="p" color="secondary">
              —
            </Text>
          )}
        </InsightCell>
      </InsightsGrid>

      {stats.genreChart.length > 0 ? (
        <GenreChartPanel
          $fillHeight={fillHeight}
          role="region"
          aria-label="Top genres by number of books in the catalog"
        >
          <GenreChartTitle>Genre mix</GenreChartTitle>
          <GenreChartCaption>
            Share of tagged books across your top genres (by count).
          </GenreChartCaption>
          <GenreChartList role="list">
            {(() => {
              const max = Math.max(
                ...stats.genreChart.map((g) => g.count),
                1
              );
              return stats.genreChart.map(({ genre, count }, index) => (
                <GenreChartRow
                  key={genre}
                  role="listitem"
                  aria-label={`${genre}, ${count} ${
                    count === 1 ? "book" : "books"
                  }`}
                >
                  <GenreChartLabel title={genre}>{genre}</GenreChartLabel>
                  <GenreChartTrack aria-hidden>
                    <GenreChartBar
                      $index={index}
                      style={{ width: `${(count / max) * 100}%` }}
                    />
                  </GenreChartTrack>
                  <GenreChartValue aria-hidden>{count}</GenreChartValue>
                </GenreChartRow>
              ));
            })()}
          </GenreChartList>
        </GenreChartPanel>
      ) : null}

      {stats.pageLengthChart.some((row) => row.count > 0) ? (
        <InsightBarChartPanel
          $fillHeight={fillHeight}
          role="region"
          aria-label="Books in the catalog by page length"
        >
          <GenreChartTitle>Catalog by length</GenreChartTitle>
          <GenreChartCaption>
            Page-count buckets for books that list a length.
          </GenreChartCaption>
          <InsightBarRows
            barPalette="slate"
            items={stats.pageLengthChart.map((row) => ({
              key: row.label,
              label: row.label,
              count: row.count,
            }))}
            ariaDescribe={(label, count) =>
              `${label}: ${count} ${count === 1 ? "book" : "books"}`
            }
          />
        </InsightBarChartPanel>
      ) : null}

      <StatsDetails $fillHeight={fillHeight}>
        <CatalogSummaryPanel>
          <CatalogSummaryColumn>
            <InsightKicker>Books in catalog</InsightKicker>
            <PagesInsightValue>{stats.totalBooks}</PagesInsightValue>
          </CatalogSummaryColumn>
          <CatalogSummaryColumn>
            <InsightKicker>Average rating</InsightKicker>
            <CatalogRatingValue>{stats.averageRating} / 5</CatalogRatingValue>
            <CatalogRatingHint>
              Community or your ratings
            </CatalogRatingHint>
          </CatalogSummaryColumn>
        </CatalogSummaryPanel>

        <StatSection>
          <SectionTitle variant="h3">Genres</SectionTitle>
          {stats.distinctGenreCount > 0 ? (
            <GenreMeta>{stats.distinctGenreCount} distinct genres</GenreMeta>
          ) : null}
          {stats.topGenres.length > 0 ? (
            <GenreList>
              {stats.topGenres.map((genre, index) => (
                <GenreLink key={index} genre={genre}>
                  {genre}
                </GenreLink>
              ))}
            </GenreList>
          ) : (
            <Text variant="p" color="secondary">
              No genre data available
            </Text>
          )}
        </StatSection>
      </StatsDetails>
    </DashboardContainer>
  )
}

const DashboardContainer = styled.div<{
  $fillHeight: boolean
}>`
  ${dashboardShell}
  box-sizing: border-box;
  max-width: 100%;
  min-width: 0;
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};

  @media (min-width: 768px) {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
  }

  ${({ $fillHeight }) =>
    $fillHeight &&
    css`
      margin-bottom: 0;
      height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;
      /* Same inset as HomepageSection prominent + dense (Bookshelf module). */
      padding: ${theme.spacing.md} ${theme.spacing.md};

      @media (min-width: 768px) {
        padding: ${theme.spacing.lg} ${theme.spacing.lg};
      }
    `}
`

const DashboardTitle = styled(Text)`
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;

  && {
    margin-bottom: 0;
    @media (max-width: 599px) {
      font-size: ${theme.fontSizes['2xl']};
      line-height: ${theme.lineHeights['2xl']};
    }
  }
`

const InsightsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.md};
  margin: ${theme.spacing.lg} 0 ${theme.spacing.lg};
  min-width: 0;
  width: 100%;

  @media (min-width: 560px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

const InsightCell = styled(ModuleInsetPanel).attrs({
  $tone: "neutral" as const,
  $size: "tile" as const,
})`
  container-type: inline-size;
  min-width: 0;
  max-width: 100%;
`

const InsightKicker = styled.p`
  margin: 0 0 ${theme.spacing.sm};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${theme.colors.muted};
  line-height: 1.35;
  max-width: 100%;
  overflow-wrap: break-word;
  hyphens: auto;

  @media (max-width: 399px) {
    letter-spacing: 0.03em;
  }
`

/** Fluid type from cell width so long totals don’t spill out of narrow columns. */
const PagesInsightValue = styled.div`
  min-width: 0;
  max-width: 100%;
  font-weight: ${theme.fontWeights.bold};
  letter-spacing: -0.02em;
  color: ${theme.colors.primary};
  line-height: 1.12;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
  font-size: ${theme.fontSizes.xl};

  @supports (font-size: 1cqi) {
    font-size: clamp(
      ${theme.fontSizes.sm},
      3.25cqi + 0.4rem,
      ${theme.fontSizes["2xl"]}
    );
  }
`

const InsightEmphasis = styled.p`
  margin: 0 0 ${theme.spacing.xs};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semibold};
  line-height: ${theme.lineHeights.base};
  color: ${theme.colors.primary};
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
`

const InsightAuthorLink = styled(Link)`
  display: inline-block;
  max-width: 100%;
  margin: 0 0 ${theme.spacing.xs};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semibold};
  line-height: ${theme.lineHeights.base};
  color: ${theme.colors.blue[500]};
  text-decoration: none;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;

  &:hover {
    color: ${theme.colors.blue[600]};
    text-decoration: underline;
  }
`

const InsightMeta = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.secondary};
  line-height: ${theme.lineHeights.sm};
`

/** Semantic h3 for outline; size matches former h4 inside inset panels. */
const SectionTitle = styled(Text)`
  && {
    font-size: ${theme.fontSizes["2xl"]};
    line-height: ${theme.lineHeights["2xl"]};
    letter-spacing: -0.02em;
    margin-bottom: ${theme.spacing.md};
  }
`

const StatsDetails = styled.div<{ $fillHeight: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  min-width: 0;
  width: 100%;

  ${({ $fillHeight }) =>
    $fillHeight &&
    css`
      flex: 1;
      min-height: 0;
    `}
`

const CatalogSummaryPanel = styled(ModuleInsetPanel).attrs({
  $tone: "neutral" as const,
  $size: "well" as const,
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.md};
  min-width: 0;
  width: 100%;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${theme.spacing.lg};
    align-items: start;
  }
`

const CatalogSummaryColumn = styled.div`
  min-width: 0;

  & + & {
    padding-top: ${theme.spacing.md};
    border-top: 1px solid rgba(15, 23, 42, 0.08);
  }

  @media (min-width: 480px) {
    & + & {
      padding-top: 0;
      border-top: none;
      padding-left: ${theme.spacing.lg};
      margin-left: 0;
      border-left: 1px solid rgba(15, 23, 42, 0.08);
    }
  }
`

const CatalogRatingValue = styled.div`
  margin: 0;
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  line-height: ${theme.lineHeights.lg};
  color: ${theme.colors.primary};
  font-variant-numeric: tabular-nums;
`

const CatalogRatingHint = styled.p`
  margin: ${theme.spacing.sm} 0 0;
  font-size: ${theme.fontSizes.xs};
  line-height: ${theme.lineHeights.sm};
  color: ${theme.colors.muted};
`

const StatSection = styled(ModuleInsetPanel).attrs({
  $tone: "neutral" as const,
  $size: "well" as const,
})`
  min-width: 0;
  max-width: 100%;
`

const GenreMeta = styled.p`
  margin: 0 0 ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.secondary};
`

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
`

const GenreChartPanel = styled(ModuleInsetPanel).attrs({
  $tone: "neutral" as const,
  $size: "well" as const,
})<{ $fillHeight: boolean }>`
  margin: 0 0 ${theme.spacing.lg};
  min-width: 0;
  width: 100%;
  text-align: left;

  ${({ $fillHeight }) =>
    $fillHeight &&
    css`
      flex-shrink: 0;
    `}
`

const GenreChartTitle = styled.h3`
  margin: 0 0 ${theme.spacing.xs};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  line-height: ${theme.lineHeights.lg};
  letter-spacing: -0.02em;
  color: ${theme.colors.primary};
`

const GenreChartCaption = styled.p`
  margin: 0 0 ${theme.spacing.md};
  font-size: ${theme.fontSizes.xs};
  line-height: ${theme.lineHeights.sm};
  color: ${theme.colors.muted};
`

const GenreChartBar = styled.div<{ $index: number }>`
  height: 100%;
  min-width: 3px;
  border-radius: ${theme.borderRadius.full};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
  transition: width 0.55s cubic-bezier(0.22, 1, 0.36, 1);

  ${({ $index }) => {
    const t = ($index % 6) / 5;
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

const VizPanel = styled(ModuleInsetPanel).attrs({
  $tone: "neutral" as const,
  $size: "well" as const,
})<{ $fillHeight: boolean }>`
  position: relative;
  min-width: 0;
  width: 100%;
  text-align: left;

  ${({ $fillHeight }) =>
    $fillHeight &&
    css`
      flex-shrink: 0;
    `}
`

const InsightBarChartPanel = styled(VizPanel)`
  margin: 0 0 ${theme.spacing.lg};
`
