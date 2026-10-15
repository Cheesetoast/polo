import { useMemo, useState, type FormEvent } from "react"
import { Link, navigate } from "gatsby"
import styled, { css, keyframes } from "styled-components"
import booksData from "../data/books.json"
import { SITE_CONFIG } from "../constants"
import { useBookStatus } from "../hooks/useBookStatus"
import { useReadingGoal } from "../hooks/useReadingGoal"
import { getAuthorById } from "../utils/authorUtils"
import { GoalProgressRing, getYearProgress } from "./GoalProgressRing"
import { ReadingActivityHeatmap } from "./ReadingActivityHeatmap"

const BOOK_OF_THE_DAY = {
  title: "The Hobbit",
  author: "J.R.R. Tolkien",
  authorId: "j-r-r-tolkien",
  isbn: "978-0547928227",
  pages: 310,
} as const

const COVER_TONES = ["#e85a4f", "#f5c042", "#5b8def", "#9b6bff", "#34c759", "#ff8a65"]

function bookPathFromIsbn(isbn: string) {
  return `/book/${isbn.replace(/-/g, "")}`
}

function coverTone(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash + seed.charCodeAt(i) * 17) % COVER_TONES.length
  return COVER_TONES[hash]
}

function estimateTimeLeft(pages = 300, progress = 0) {
  const remaining = Math.max(0, Math.round(pages * (1 - progress / 100)))
  const minutes = Math.max(15, Math.round(remaining * 1.2))
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `~${m}m`
  return m === 0 ? `~${h}h` : `~${h}h ${m}m`
}

type HomeDashboardProps = {
  homepageTitle?: string | null
}

export function HomeDashboard({ homepageTitle }: HomeDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const books = booksData as Array<{
    title: string
    author: string
    authorId?: string
    isbn: string
    communityRating?: number
    genres?: string[]
    pages?: number
  }>

  const { booksWithStatus, activityByDay } = useBookStatus(booksData as any)
  const { goal: readingGoal } = useReadingGoal()

  const finishedBooks = booksWithStatus.filter((b) => b.status === "finished").length
  const currentlyReadingCount = booksWithStatus.filter(
    (b) => b.status === "currently-reading"
  ).length
  const wantToReadCount = booksWithStatus.filter(
    (b) => b.status === "want-to-read"
  ).length
  const goalProgress = Math.min(1, finishedBooks / Math.max(readingGoal, 1))
  const yearProgress = useMemo(() => getYearProgress(), [])
  const calendarYear = useMemo(() => new Date().getFullYear(), [])

  const topAuthors = useMemo(() => {
    const counts = new Map<string, { name: string; id?: string; count: number }>()
    books.forEach((book) => {
      const key = book.authorId || book.author
      const prev = counts.get(key)
      if (prev) prev.count += 1
      else counts.set(key, { name: book.author, id: book.authorId, count: 1 })
    })
    return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 2)
  }, [books])

  const bestsellers = useMemo(() => {
    return [...books]
      .filter((b) => typeof b.communityRating === "number")
      .sort((a, b) => (b.communityRating || 0) - (a.communityRating || 0))
      .slice(0, 8)
  }, [books])

  const topGenres = useMemo(() => {
    const counts = new Map<string, number>()
    books.forEach((book) => {
      book.genres?.forEach((genre) => {
        counts.set(genre, (counts.get(genre) || 0) + 1)
      })
    })
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 12)
  }, [books])

  const currentlyReading = useMemo(() => {
    const reading = booksWithStatus.filter((b) => b.status === "currently-reading")
    if (reading.length > 0) return reading.slice(0, 4)
    return booksWithStatus
      .filter((b) => b.status === "want-to-read" || !b.status)
      .slice(0, 3)
      .map((b, i) => ({ ...b, progress: [68, 34, 12][i] ?? 20 }))
  }, [booksWithStatus])

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/search-results?search=${encodeURIComponent(searchQuery.trim())}`)
  }

  const goRandom = () => {
    if (!books.length) return
    const book = books[Math.floor(Math.random() * books.length)]
    navigate(bookPathFromIsbn(book.isbn))
  }

  const siteTitle = SITE_CONFIG.SITE_NAME
  const tagline = homepageTitle?.trim() || "Read. Track. Repeat."
  const todayLabel = new Date().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })

  return (
    <ContentRoot>
        <Header>
          <GreetingBlock>
            <Greeting>{siteTitle}</Greeting>
            <TaglineSeparator aria-hidden>/</TaglineSeparator>
            <Tagline>{tagline}</Tagline>
          </GreetingBlock>
          <HeaderActions onSubmit={onSearch}>
            <SearchField>
              <SearchIcon aria-hidden />
              <SearchInput
                type="search"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search books"
              />
            </SearchField>
            <DiscoverButton type="button" onClick={() => navigate("/search-results")}>
              Discover books
            </DiscoverButton>
          </HeaderActions>
        </Header>

        <TopGrid>
          <Card $delay={0}>
            <CardTop>
              <CardTitle>{calendarYear} reading goal</CardTitle>
              <TextLink to="/reading-goal">Edit goal</TextLink>
            </CardTop>
            <GoalCardBody to="/reading-goal" aria-label="Open reading goal settings">
              <DateRow>
                <DateChip>{todayLabel}</DateChip>
              </DateRow>
              <GaugeWrap>
                <GoalProgressRing
                  progress={goalProgress}
                  yearProgress={yearProgress}
                  year={calendarYear}
                  gradientId="home-goal-progress-grad"
                />
                <GaugeCenter>
                  <GaugeValue>
                    {finishedBooks} / {readingGoal}
                  </GaugeValue>
                  <GaugeLabel>books</GaugeLabel>
                </GaugeCenter>
              </GaugeWrap>
              <GoalLegend>
                <LegendItem>
                  <LegendSwatch $tone="year" />
                  Year so far
                </LegendItem>
                <LegendItem>
                  <LegendSwatch $tone="books" />
                  Books finished
                </LegendItem>
              </GoalLegend>
            </GoalCardBody>
          </Card>

          <Card $delay={80}>
            <CardTop>
              <CardTitle>Top authors</CardTitle>
              <TextLink to="/authors">View All</TextLink>
            </CardTop>
            <AuthorList>
              {topAuthors.map((author) => {
                const profile = author.id ? getAuthorById(author.id) : undefined
                const href = author.id
                  ? `/author/${author.id}`
                  : `/search-results?author=${encodeURIComponent(author.name)}`
                return (
                  <AuthorRow key={author.name}>
                    <AuthorAvatar $tone={coverTone(author.name)}>
                      {(profile?.name || author.name).slice(0, 1)}
                    </AuthorAvatar>
                    <AuthorMeta>
                      <AuthorName>{author.name}</AuthorName>
                      <AuthorCount>
                        {author.count} book{author.count === 1 ? "" : "s"}
                      </AuthorCount>
                    </AuthorMeta>
                    <ExploreButton to={href}>Explore</ExploreButton>
                  </AuthorRow>
                )
              })}
            </AuthorList>
          </Card>

          <PickCard $delay={160}>
            <PickTop>
              <PickEyebrow>Book of the day</PickEyebrow>
              <ReadButton to={bookPathFromIsbn(BOOK_OF_THE_DAY.isbn)}>
                <OpenBookIcon />
                Read
              </ReadButton>
            </PickTop>
            <PickTitle>
              <PickTitleLink to={bookPathFromIsbn(BOOK_OF_THE_DAY.isbn)}>
                {BOOK_OF_THE_DAY.title}
              </PickTitleLink>
            </PickTitle>
            <PickAuthor>
              by{" "}
              <PickAuthorLink to={`/author/${BOOK_OF_THE_DAY.authorId}`}>
                {BOOK_OF_THE_DAY.author}
              </PickAuthorLink>
            </PickAuthor>
            <PickMeta>{BOOK_OF_THE_DAY.pages.toLocaleString()} pages</PickMeta>
            <PickCovers aria-hidden>
              <PickCover $tone="#f5c042" $offset={0} />
              <PickCover $tone="#fff7e6" $offset={1} />
              <PickCover $tone="#2b2118" $offset={2} />
            </PickCovers>
          </PickCard>
        </TopGrid>

        <Section>
          <SectionHead>
            <SectionTitle>Organize your reading</SectionTitle>
            <TextLink to="/bookshelf">Open bookshelf →</TextLink>
          </SectionHead>
          <ShelfGrid>
            <ShelfCard $delay={180}>
              <ShelfValue>{wantToReadCount}</ShelfValue>
              <ShelfLabel>Want to read</ShelfLabel>
            </ShelfCard>
            <ShelfCard $delay={220}>
              <ShelfValue>{currentlyReadingCount}</ShelfValue>
              <ShelfLabel>Reading</ShelfLabel>
            </ShelfCard>
            <ShelfCard $delay={260}>
              <ShelfValue>{finishedBooks}</ShelfValue>
              <ShelfLabel>Finished</ShelfLabel>
            </ShelfCard>
          </ShelfGrid>
          <ShelfNote>
            These counts mirror your three bookshelf columns. Update a book’s status and
            they’ll move with you — stored in this browser so you can pick up anytime.
          </ShelfNote>
          <ActivityGenresGrid>
            <ActivityCol>
              <ReadingActivityHeatmap activityByDay={activityByDay} embedded />
            </ActivityCol>
            <GenresCol>
              <GenresCard>
                <GenresHead>
                  <GenresTitle>Genres</GenresTitle>
                  <TextLink to="/genres">View all</TextLink>
                </GenresHead>
                <GenresCaption>
                  Browse the collection by genre — counts are books in your library.
                </GenresCaption>
                <GenreList>
                  {topGenres.map(([genre, count]) => (
                    <GenreListItem
                      key={genre}
                      to={`/genre/${encodeURIComponent(genre)}`}
                    >
                      <GenreName>{genre}</GenreName>
                      <GenreCount>{count}</GenreCount>
                    </GenreListItem>
                  ))}
                </GenreList>
              </GenresCard>
            </GenresCol>
          </ActivityGenresGrid>
        </Section>

        <Section>
          <SectionHead>
            <SectionTitle>Bestsellers</SectionTitle>
            <TextLink to="/search-results">Full list</TextLink>
          </SectionHead>
          <BestsellerGrid>
            {bestsellers.map((book, i) => (
              <BestsellerCard key={book.isbn} $delay={220 + i * 60}>
                <MiniCover $tone={coverTone(book.isbn)}>
                  {book.title.slice(0, 1)}
                </MiniCover>
                <BestsellerMeta>
                  <BestsellerTitle>{book.title}</BestsellerTitle>
                  <BestsellerAuthor>{book.author}</BestsellerAuthor>
                  <RatingRow>
                    <RatingScore>{(book.communityRating || 0).toFixed(1)}</RatingScore>
                    <Stars aria-hidden>
                      {"★★★★★".split("").map((s, idx) => (
                        <Star
                          key={idx}
                          $on={idx < Math.round(book.communityRating || 0)}
                        >
                          {s}
                        </Star>
                      ))}
                    </Stars>
                  </RatingRow>
                </BestsellerMeta>
                <ArrowButton
                  to={bookPathFromIsbn(book.isbn)}
                  aria-label={`Open ${book.title}`}
                >
                  →
                </ArrowButton>
              </BestsellerCard>
            ))}
          </BestsellerGrid>
        </Section>

        <Section>
          <SectionHead>
            <SectionTitle>Currently Reading</SectionTitle>
            <TextLink to="/bookshelf">View All</TextLink>
          </SectionHead>
          <ReadingTable>
            <TableHead>
              <span>Title</span>
              <span>Author</span>
              <span>Genre</span>
              <span>Time Left</span>
              <span>Progress</span>
              <span />
            </TableHead>
            {currentlyReading.map((book, i) => {
              const progress = Math.min(100, Math.max(0, book.progress || 0))
              const genre = book.genres?.[0] || "Fiction"
              return (
                <TableRow key={book.isbn} $delay={320 + i * 50}>
                  <TitleCell>
                    <RowIcon $tone={coverTone(book.isbn)} />
                    <RowTitleLink to={bookPathFromIsbn(book.isbn)}>
                      {book.title}
                    </RowTitleLink>
                  </TitleCell>
                  <span>{book.author}</span>
                  <span>{genre}</span>
                  <TimeCell>
                    <ClockIcon />
                    {estimateTimeLeft(book.pages, progress)}
                  </TimeCell>
                  <ProgressCell>
                    <ProgressTrack>
                      <ProgressFill $value={progress} />
                    </ProgressTrack>
                    <ProgressLabel>{progress}%</ProgressLabel>
                  </ProgressCell>
                  <MoreButton
                    type="button"
                    aria-label={`More actions for ${book.title}`}
                    onClick={goRandom}
                  >
                    ···
                  </MoreButton>
                </TableRow>
              )
            })}
          </ReadingTable>
        </Section>
    </ContentRoot>
  )
}

/* ——— Icons ——— */

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}
function OpenBookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5.5A3.5 3.5 0 0 1 7.5 4H20v14H7.5A3.5 3.5 0 0 0 4 21.5V5.5Z" />
      <path d="M4 5.5A3.5 3.5 0 0 0 7.5 4" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

/* ——— Styles ——— */

const dash = {
  bg: "#1a1210",
  card: "#241c1a",
  cardSoft: "#2c2321",
  yellow: "#f5c042",
  red: "#e85a4f",
  text: "#f7f1ec",
  muted: "#9a8f8a",
  line: "rgba(255,255,255,0.08)",
  font: `'Plus Jakarta Sans', 'Inter', system-ui, sans-serif`,
}

const riseIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const gaugeFill = keyframes`
  from { opacity: 0.4; }
  to { opacity: 1; }
`

const ContentRoot = styled.div`
  --dash-bg: ${dash.bg};
  --dash-card: ${dash.card};
  --dash-yellow: ${dash.yellow};
  --dash-red: ${dash.red};
  --dash-text: ${dash.text};
  --dash-muted: ${dash.muted};
  min-width: 0;
  color: var(--dash-text);
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
`

const GreetingBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  min-width: 0;
`

const Greeting = styled.h1`
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2.15rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--dash-yellow);
`

const TaglineSeparator = styled.span`
  color: var(--dash-muted);
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1;
  opacity: 0.9;
`

const Tagline = styled.p`
  margin: 0;
  font-size: clamp(0.95rem, 1.6vw, 1.15rem);
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--dash-text);
  opacity: 0.72;
  line-height: 1.2;
  white-space: nowrap;
`

const HeaderActions = styled.form`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1 1 320px;
  justify-content: flex-end;
  min-width: 0;
`

const SearchField = styled.label`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex: 1 1 220px;
  max-width: 360px;
  min-width: 0;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  background: var(--dash-card);
  border: 1px solid ${dash.line};
  color: var(--dash-muted);
`

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--dash-text);
  font: inherit;
  font-size: 0.95rem;

  &::placeholder {
    color: var(--dash-muted);
  }
`

const DiscoverButton = styled.button`
  appearance: none;
  border: 0;
  cursor: pointer;
  white-space: nowrap;
  padding: 0.85rem 1.25rem;
  border-radius: 999px;
  background: var(--dash-yellow);
  color: #1a1210;
  font: inherit;
  font-weight: 700;
  font-size: 0.95rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(245, 192, 66, 0.28);
  }
`

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.15fr 0.95fr;
  gap: 1rem;
  margin-bottom: 1.75rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`

const cardMotion = css<{ $delay?: number }>`
  animation: ${riseIn} 0.55s ease both;
  animation-delay: ${({ $delay = 0 }) => $delay}ms;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const Card = styled.section<{ $delay?: number }>`
  background: var(--dash-card);
  border: 1px solid ${dash.line};
  border-radius: 28px;
  padding: 1.25rem 1.35rem 1.4rem;
  min-width: 0;
  ${cardMotion}
`

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
`

const GoalCardBody = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: none;
  border-radius: 18px;
  outline: none;
  overflow: visible;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${dash.yellow};
  }
`

const DateRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.25rem;
`

const GaugeWrap = styled.div`
  position: relative;
  width: min(220px, 100%);
  aspect-ratio: 1;
  margin: 0.45rem auto 0;
  overflow: visible;
  animation: ${gaugeFill} 0.8s ease both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const GaugeCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.15rem;
`

const GaugeValue = styled.div`
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`

const GaugeLabel = styled.div`
  font-size: 0.8rem;
  color: var(--dash-muted);
`

const DateChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background: var(--dash-red);
  color: white;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
`

const GoalLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.65rem 1rem;
  margin-top: 0.85rem;
`

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--dash-muted);
`

const LegendSwatch = styled.span<{ $tone: "year" | "books" }>`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ $tone }) =>
    $tone === "year"
      ? "rgba(255, 255, 255, 0.35)"
      : `linear-gradient(135deg, ${dash.red}, ${dash.yellow})`};
`

const TextLink = styled(Link)`
  color: var(--dash-muted);
  font-size: 0.85rem;
  font-weight: 600;
  transition: color 0.15s ease;

  &:hover {
    color: var(--dash-yellow);
  }
`

const AuthorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const AuthorAvatar = styled.div<{ $tone: string }>`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 700;
  background: ${({ $tone }) => $tone};
  color: #1a1210;
  flex: none;
`

const AuthorMeta = styled.div`
  min-width: 0;
  flex: 1;
`

const AuthorName = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const AuthorCount = styled.div`
  color: var(--dash-muted);
  font-size: 0.8rem;
`

const ExploreButton = styled(Link)`
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  border: 1px solid ${dash.line};
  background: rgba(255, 255, 255, 0.03);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--dash-text);
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: rgba(245, 192, 66, 0.45);
    background: rgba(245, 192, 66, 0.08);
  }
`

const PickCard = styled.section<{ $delay?: number }>`
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 1.25rem 1.35rem 1.4rem;
  background:
    radial-gradient(circle at 85% 20%, rgba(255, 255, 255, 0.18), transparent 35%),
    linear-gradient(155deg, #ff6b5a 0%, #e85a4f 55%, #c9443b 100%);
  min-height: 260px;
  display: flex;
  flex-direction: column;
  ${cardMotion}

  @media (max-width: 1100px) {
    grid-column: 1 / -1;
  }
`

const PickTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
`

const PickEyebrow = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
`

const ReadButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  background: white;
  color: #1a1210;
  font-size: 0.85rem;
  font-weight: 700;
`

const PickTitle = styled.h3`
  margin: 1.1rem 0 0.25rem;
  font-size: 1.55rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  max-width: 12ch;
`

const PickTitleLink = styled(Link)`
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const PickAuthor = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
`

const PickAuthorLink = styled(Link)`
  color: inherit;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    opacity: 1;
  }
`

const PickMeta = styled.p`
  margin: 0.55rem 0 0;
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.85;
`

const PickCovers = styled.div`
  position: absolute;
  right: 1.1rem;
  bottom: 1.4rem;
  width: 120px;
  height: 110px;
`

const PickCover = styled.div<{ $tone: string; $offset: number }>`
  position: absolute;
  width: 72px;
  height: 96px;
  border-radius: 10px;
  background: ${({ $tone }) => $tone};
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
  transform: rotate(${({ $offset }) => -8 + $offset * 8}deg)
    translate(${({ $offset }) => $offset * 18}px, ${({ $offset }) => $offset * 4}px);
`

const Section = styled.section`
  margin-bottom: 1.75rem;
`

const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.9rem;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`

const ShelfGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`

const ShelfCard = styled.div<{ $delay?: number }>`
  background: var(--dash-card);
  border: 1px solid ${dash.line};
  border-radius: 22px;
  padding: 1.15rem 1rem;
  text-align: center;
  min-width: 0;
  ${cardMotion}
`

const ShelfValue = styled.div`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--dash-yellow);
  line-height: 1.15;
`

const ShelfLabel = styled.div`
  margin-top: 0.35rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--dash-muted);
`

const ShelfNote = styled.p`
  margin: 0.9rem 0 0;
  max-width: 46rem;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--dash-muted);
`

const ActivityGenresGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 1rem;
  margin-top: 1.1rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const ActivityCol = styled.div`
  min-width: 0;
`

const GenresCol = styled.div`
  min-width: 0;
`

const GenresCard = styled.aside`
  background: var(--dash-card);
  border: 1px solid ${dash.line};
  border-radius: 24px;
  padding: 1.15rem 1.2rem 1.25rem;
  min-width: 0;
`

const GenresHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
`

const GenresTitle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
`

const GenresCaption = styled.p`
  margin: 0 0 0.85rem;
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--dash-muted);
`

const GenreList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

const GenreName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.15s ease;
`

const GenreListItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.45rem 0.55rem;
  border-radius: 10px;
  color: inherit;
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &:hover ${GenreName} {
    color: var(--dash-yellow);
  }
`

const GenreCount = styled.span`
  flex: none;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--dash-muted);
`

const BestsellerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`

const BestsellerCard = styled.article<{ $delay?: number }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 24px;
  background: var(--dash-card);
  border: 1px solid ${dash.line};
  min-width: 0;
  ${cardMotion}
`

const MiniCover = styled.div<{ $tone: string }>`
  width: 56px;
  height: 72px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 1.2rem;
  color: #1a1210;
  background: ${({ $tone }) => $tone};
  flex: none;
`

const BestsellerMeta = styled.div`
  min-width: 0;
  flex: 1;
`

const BestsellerTitle = styled.div`
  font-weight: 700;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const BestsellerAuthor = styled.div`
  color: var(--dash-muted);
  font-size: 0.85rem;
  margin: 0.15rem 0 0.45rem;
`

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
`

const RatingScore = styled.span`
  font-weight: 800;
  font-size: 0.95rem;
`

const Stars = styled.span`
  display: inline-flex;
  gap: 1px;
`

const Star = styled.span<{ $on: boolean }>`
  color: ${({ $on }) => ($on ? dash.yellow : "rgba(255,255,255,0.15)")};
  font-size: 0.75rem;
  line-height: 1;
`

const ArrowButton = styled(Link)`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid ${dash.line};
  color: var(--dash-text);
  font-size: 1.1rem;
  flex: none;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: rgba(245, 192, 66, 0.16);
    border-color: rgba(245, 192, 66, 0.4);
  }
`

const ReadingTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`

const TableHead = styled.div`
  display: grid;
  grid-template-columns: minmax(140px, 1.4fr) 1fr 0.9fr 0.85fr 1.1fr 40px;
  gap: 0.75rem;
  padding: 0 1rem;
  color: var(--dash-muted);
  font-size: 0.78rem;
  font-weight: 600;

  @media (max-width: 900px) {
    display: none;
  }
`

const TableRow = styled.div<{ $delay?: number }>`
  display: grid;
  grid-template-columns: minmax(140px, 1.4fr) 1fr 0.9fr 0.85fr 1.1fr 40px;
  gap: 0.75rem;
  align-items: center;
  padding: 0.9rem 1rem;
  border-radius: 20px;
  background: var(--dash-card);
  border: 1px solid ${dash.line};
  font-size: 0.9rem;
  ${cardMotion}

  @media (max-width: 900px) {
    grid-template-columns: 1fr auto;
    gap: 0.5rem 0.75rem;

    > span:nth-child(2),
    > span:nth-child(3),
    > :nth-child(6) {
      display: none;
    }

    > :nth-child(4) {
      grid-column: 2;
      grid-row: 1;
      justify-self: end;
    }

    > :nth-child(5) {
      grid-column: 1 / -1;
    }
  }
`

const TitleCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
`

const RowIcon = styled.div<{ $tone: string }>`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: ${({ $tone }) => $tone};
  flex: none;
`

const RowTitleLink = styled(Link)`
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: var(--dash-yellow);
  }
`

const TimeCell = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--dash-muted);
  white-space: nowrap;
`

const ProgressCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
`

const ProgressTrack = styled.div`
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  min-width: 60px;
`

const ProgressFill = styled.div<{ $value: number }>`
  width: ${({ $value }) => $value}%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #f5c042, #ffd978);
  transition: width 0.6s ease;
`

const ProgressLabel = styled.span`
  font-weight: 700;
  font-size: 0.85rem;
  min-width: 2.5rem;
`

const MoreButton = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--dash-muted);
  cursor: pointer;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  line-height: 1;
  padding: 0.25rem;

  &:hover {
    color: var(--dash-text);
  }
`

export default HomeDashboard
