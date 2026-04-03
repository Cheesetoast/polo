import styled, { css } from "styled-components"
import { Link } from "gatsby"
import { theme } from "../styles/theme"
import { dashboardShell } from "../styles/surfaceStyles"
import { ModuleInsetPanel } from "./ModuleInsetPanel"
import { Text } from "./Text"
import { Eyebrow } from "./Eyebrow"
import { GenreLink } from "./GenreLink"

export interface DashboardStats {
  totalBooks: number
  topGenres: string[]
  averageRating: string
  totalPages: number
  distinctGenreCount: number
  topAuthor: {
    name: string
    count: number
    authorId?: string
  } | null
  longestBook: { title: string; pages: number } | null
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

      <StatsDetails $fillHeight={fillHeight}>
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

        <StatSection>
          <SectionTitle variant="h3">Average rating</SectionTitle>
          <Text variant="p" size="lg" weight="semibold">
            {stats.averageRating} / 5
          </Text>
          <RatingHint>Across books with a community or your rating</RatingHint>
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
    `}
`

const DashboardTitle = styled(Text)`
  margin-bottom: ${theme.spacing.lg};
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;

  && {
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
  margin: 0 0 ${theme.spacing.lg};
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
  padding: ${theme.spacing.md};
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
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.lg};
  min-width: 0;
  width: 100%;

  @media (min-width: 420px) {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 12.5rem), 1fr));
  }

  ${({ $fillHeight }) =>
    $fillHeight &&
    css`
      flex: 1;
      min-height: 0;
      align-content: start;
    `}
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

const RatingHint = styled.p`
  margin: ${theme.spacing.sm} 0 0;
  font-size: ${theme.fontSizes.xs};
  line-height: ${theme.lineHeights.sm};
  color: ${theme.colors.muted};
`
