import type { HeadFC, PageProps } from "gatsby"
import { useStaticQuery, graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Text } from "../components/Text"
import { ContentWrapper } from "../components/ContentWrapper"
import { SITE_CONFIG, MODAL_CONFIG } from "../constants"
import { Dashboard } from "../components/Dashboard"
import { WelcomeModal } from "../components/WelcomeModal"

import booksData from "../data/books.json"
import { useState, useMemo, useEffect, useCallback } from "react"
import { useBookStatus } from "../hooks/useBookStatus"
import { navigate, Link } from "gatsby"
import styled, { css } from "styled-components"
import {
  heroEyebrowPulse,
  heroOrbDrift,
  heroTitleFlow,
  homeModuleSlamIn,
  linkShimmer,
} from "../styles/motion"
import { rgba, theme } from "../styles/theme"
import { Button } from "../components/Button"
import { TextInput } from "../components/TextInput"
import { Eyebrow } from "../components/Eyebrow"
import { HomepageSection } from "../components/HomepageSection"
import { HomepageAuthorQuote } from "../components/HomepageAuthorQuote"
import { ModuleInsetPanel } from "../components/ModuleInsetPanel"

const BOOKS_DATA = booksData

/** Spotlight beside search; always The Hobbit (matches `src/data/books.json`). */
const BOOK_OF_THE_DAY = {
  title: "The Hobbit",
  author: "J.R.R. Tolkien",
  authorId: "j-r-r-tolkien",
  isbn: "978-0547928227",
  pages: 310,
} as const

function bookPathFromIsbn(isbn: string) {
  return `/book/${isbn.replace(/-/g, "")}`
}

/** Once per browser tab session; avoids replaying module entrance on client navigations back to `/`. */
const HOME_MODULE_ENTRANCE_SESSION_KEY = "polo_home_module_entrance"

type ModuleEntrancePhase = "hold" | "play" | "done"

const HERO_ORBS = [
  { left: "10%", top: "24%", delay: -0.6 },
  { left: "80%", top: "14%", delay: -2.8 },
  { left: "64%", top: "70%", delay: -5 },
  { left: "22%", top: "76%", delay: -7.2 },
] as const

interface Book {
  title: string;
  author: string;
  authorId?: string;
  description: {
    description: string;
  };
  image?: {
    gatsbyImageData: any;
    title?: string;
  } | null;
  isbn: string;
  communityRating?: number;
  userRating?: number | null;
  genres?: string[];
  progress?: number;
  dateStarted?: string | null;
  dateFinished?: string | null;
  pages?: number;
}


const IndexPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [welcomeChecked, setWelcomeChecked] = useState(false);
  const [moduleEntranceDone, setModuleEntranceDone] = useState(false);

  const persistModuleEntranceDone = useCallback(() => {
    try {
      sessionStorage.setItem(HOME_MODULE_ENTRANCE_SESSION_KEY, "1");
    } catch {
      /* private mode / quota */
    }
    setModuleEntranceDone(true);
  }, []);

  // Welcome modal + whether module entrance already ran this session
  useEffect(() => {
    try {
      if (sessionStorage.getItem(HOME_MODULE_ENTRANCE_SESSION_KEY) === "1") {
        setModuleEntranceDone(true);
      }
    } catch {
      /* ignore */
    }

    if (MODAL_CONFIG.ENABLE_MODAL_DISMISS) {
      const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
      if (!hasSeenWelcome) {
        setShowWelcomeModal(true);
      }
    } else {
      setShowWelcomeModal(true);
    }
    setWelcomeChecked(true);
  }, []);

  const moduleEntrancePhase = useMemo((): ModuleEntrancePhase => {
    if (moduleEntranceDone) return "done";
    if (!welcomeChecked) return "hold";
    if (showWelcomeModal) return "hold";
    return "play";
  }, [moduleEntranceDone, welcomeChecked, showWelcomeModal]);

  // After entrance animation (staggered delays), mark done so it only runs once per session.
  useEffect(() => {
    if (moduleEntrancePhase !== "play") return;
    const maxDelayMs = 360;
    const durationMs = 550;
    const id = window.setTimeout(persistModuleEntranceDone, maxDelayMs + durationMs + 80);
    return () => window.clearTimeout(id);
  }, [moduleEntrancePhase, persistModuleEntranceDone]);

  // Reduced motion: skip animation but still treat entrance as finished for this session.
  useEffect(() => {
    if (!welcomeChecked || showWelcomeModal || moduleEntranceDone) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches) return;
    persistModuleEntranceDone();
  }, [
    welcomeChecked,
    showWelcomeModal,
    moduleEntranceDone,
    persistModuleEntranceDone,
  ]);

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);

    if (MODAL_CONFIG.ENABLE_MODAL_DISMISS) {
      localStorage.setItem("hasSeenWelcome", "true");
    }
  };

  // Fetch homepage title from Contentful
  const data = useStaticQuery(graphql`
    query HomepageQuery {
      contentfulHomepage {
        title
      }
    }
  `);

  const homepageTitle = data?.contentfulHomepage?.title;

  // Fallback to local data if Contentful is not available
  const books: Book[] = BOOKS_DATA;

  // Use the same book status system as the bookshelf
  const { booksWithStatus } = useBookStatus(BOOKS_DATA);

  // Memoize expensive calculations to prevent recalculation on every render
  const dashboardStats = useMemo(() => {
    // Calculate dashboard statistics using the actual reading statuses
    const finishedBooks = booksWithStatus.filter(book => book.status === 'finished').length;
    const currentlyReading = booksWithStatus.filter(book => book.status === 'currently-reading').length;
    const wantToRead = booksWithStatus.filter(book => book.status === 'want-to-read').length;

    // Calculate top genres
    const genreCounts: Record<string, number> = {};
    books.forEach(book => {
      if (book.genres) {
        book.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });
    /* All genres sorted by book count so the list matches `distinctGenreCount`. */
    const topGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([genre]) => genre);

    // Calculate average rating (use user rating if available, otherwise community rating)
    const booksWithRatings = books.filter(book => book.userRating !== undefined && book.userRating !== null || book.communityRating !== undefined && book.communityRating !== null);
    const averageRating = booksWithRatings.length > 0
      ? (booksWithRatings.reduce((sum, book) => {
        // Prefer user rating if available, otherwise use community rating
        const rating = book.userRating !== undefined && book.userRating !== null ? book.userRating : (book.communityRating || 0);
        return sum + (rating || 0);
      }, 0) / booksWithRatings.length).toFixed(1)
      : '0.0';

    const totalPages = books.reduce((sum, book) => {
      const n = book.pages;
      return sum + (typeof n === "number" && n > 0 ? n : 0);
    }, 0);

    const genreSet = new Set<string>();
    books.forEach((book) => {
      book.genres?.forEach((g) => genreSet.add(g));
    });

    const authorTally: Record<
      string,
      { name: string; count: number; authorId?: string }
    > = {};
    books.forEach((book) => {
      const key = book.authorId || book.author;
      if (!authorTally[key]) {
        authorTally[key] = {
          name: book.author,
          count: 0,
          authorId: book.authorId,
        };
      }
      authorTally[key].count += 1;
    });
    const topAuthorEntry = Object.values(authorTally).sort(
      (a, b) => b.count - a.count
    )[0];
    const topAuthor = topAuthorEntry
      ? {
          name: topAuthorEntry.name,
          count: topAuthorEntry.count,
          authorId: topAuthorEntry.authorId,
        }
      : null;

    let longestBook: { title: string; pages: number } | null = null;
    books.forEach((book) => {
      const p = book.pages;
      if (typeof p !== "number" || p <= 0) return;
      if (!longestBook || p > longestBook.pages) {
        longestBook = { title: book.title, pages: p };
      }
    });

    return {
      totalBooks: books.length,
      finishedBooks,
      currentlyReading,
      wantToRead,
      topGenres,
      averageRating,
      totalPages,
      distinctGenreCount: genreSet.size,
      topAuthor,
      longestBook,
    };
  }, [books, booksWithStatus]);

  return (
    <Layout>
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleCloseWelcomeModal}
      />
      <HomepageRoot>
        <HomepageCanvas>
          <HeroOrbField aria-hidden="true">
            {HERO_ORBS.map((orb, i) => (
              <HeroOrb
                key={i}
                $left={orb.left}
                $top={orb.top}
                $delay={orb.delay}
              />
            ))}
          </HeroOrbField>
          <HomepageForeground>
            <HeroBand>
              <ContentWrapper>
                <HeroMain>
                  <Eyebrow variant="accent">Your reading library</Eyebrow>
                  <Text variant="h1">
                    {homepageTitle || SITE_CONFIG.SITE_NAME}
                  </Text>
                </HeroMain>
              </ContentWrapper>
            </HeroBand>

            <ContentWrapper>
              <HomepageModulesGrid>
            <HomepageModuleSpan $phase={moduleEntrancePhase}>
              <HomepageSection variant="prominent" inModuleGrid>
                <SectionSplit>
                  <SectionSplitMain>
                    <Eyebrow variant="neutral">Search</Eyebrow>
                    <Text variant="h2">Find your next great read</Text>
                    <SearchForm onSubmit={(e) => {
                      e.preventDefault();
                      if (searchQuery.trim()) {
                        navigate(`/search-results?search=${encodeURIComponent(searchQuery.trim())}`);
                      }
                    }}>
                      <TextInput
                        type="text"
                        aria-label="Search books by title, author, description, genres, or tags"
                        placeholder="Search by title, author, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        inputWidth="flex"
                      />
                      <Button type="submit" variant="primary" size="medium">
                        Search
                      </Button>
                    </SearchForm>
                    <BrowseAllLink to="/search-results">
                      Browse all books →
                    </BrowseAllLink>
                  </SectionSplitMain>
                  <BookOfDayPanel>
                    <Eyebrow variant="neutral">Book of the day</Eyebrow>
                    <BookOfDayTitleLine>
                      <BookOfDayTitleLink
                        to={bookPathFromIsbn(BOOK_OF_THE_DAY.isbn)}
                      >
                        {BOOK_OF_THE_DAY.title}
                      </BookOfDayTitleLink>
                      <BookOfDayBy> by </BookOfDayBy>
                      <BookOfDayAuthorLink
                        to={`/author/${BOOK_OF_THE_DAY.authorId}`}
                      >
                        {BOOK_OF_THE_DAY.author}
                      </BookOfDayAuthorLink>
                    </BookOfDayTitleLine>
                    <BookOfDayMeta>
                      {BOOK_OF_THE_DAY.pages.toLocaleString()} pages
                    </BookOfDayMeta>
                  </BookOfDayPanel>
                </SectionSplit>
              </HomepageSection>
            </HomepageModuleSpan>

            <HomepageModuleBookshelf $phase={moduleEntrancePhase}>
              <HomepageSection variant="prominent" inModuleGrid dense>
                <BookshelfSectionSplit>
                  <BookshelfSectionHeader>
                    <Eyebrow variant="neutral">Bookshelf</Eyebrow>
                    <Text variant="h2">Organize your reading</Text>
                  </BookshelfSectionHeader>
                  <BookshelfSectionMain>
                    <ShelfMiniGrid>
                      <ShelfMiniCard>
                        <ShelfMiniValue>{dashboardStats.wantToRead}</ShelfMiniValue>
                        <ShelfMiniLabel>Want to read</ShelfMiniLabel>
                      </ShelfMiniCard>
                      <ShelfMiniCard>
                        <ShelfMiniValue>{dashboardStats.currentlyReading}</ShelfMiniValue>
                        <ShelfMiniLabel>Reading</ShelfMiniLabel>
                      </ShelfMiniCard>
                      <ShelfMiniCard>
                        <ShelfMiniValue>{dashboardStats.finishedBooks}</ShelfMiniValue>
                        <ShelfMiniLabel>Finished</ShelfMiniLabel>
                      </ShelfMiniCard>
                    </ShelfMiniGrid>
                    <BrowseAllLink to="/bookshelf">Open bookshelf →</BrowseAllLink>
                    <ShelfBookshelfSupporting>
                      <Text variant="p" color="secondary" size="sm">
                        These numbers mirror your three board columns—change a book’s status and
                        the counts move with you.
                      </Text>
                      <Text variant="p" color="secondary" size="sm">
                        Your shelf is stored in the browser, so you can come back anytime and pick
                        up where you left off.
                      </Text>
                    </ShelfBookshelfSupporting>
                  </BookshelfSectionMain>
                  <ShelfAside>
                    <ShelfAsideTitle>On the board</ShelfAsideTitle>
                    <ShelfAsideList>
                      <li>Move books between columns with the status control</li>
                      <li>See rating and progress at a glance</li>
                      <li>Next column: catalog insights (not shelf status)</li>
                    </ShelfAsideList>
                  </ShelfAside>
                </BookshelfSectionSplit>
              </HomepageSection>
            </HomepageModuleBookshelf>

            <HomepageModuleQuote $phase={moduleEntrancePhase}>
              <HomepageSection variant="prominent" inModuleGrid>
                <HomepageAuthorQuote />
              </HomepageSection>
            </HomepageModuleQuote>

            <HomepageModuleStats $phase={moduleEntrancePhase}>
              <Dashboard stats={dashboardStats} fillHeight />
            </HomepageModuleStats>
              </HomepageModulesGrid>
            </ContentWrapper>
          </HomepageForeground>
        </HomepageCanvas>
      </HomepageRoot>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => (
  <SEO
    title={SITE_CONFIG.SITE_NAME}
    description="Welcome to my portfolio showcasing my work and projects."
    keywords={['portfolio', 'web development', 'design', 'react', 'gatsby']}
  />
)

/**
 * Full viewport-width hero. Pulls up by Layout `MainContent` padding-top so the wash sits
 * under the fixed nav; overlaps the next section via negative margin-bottom.
 * Keep offsets in sync with `Layout.tsx` → `MainContent` padding-top.
 */
const HERO_NAV_OFFSET_MOBILE = "100px"
const HERO_NAV_OFFSET_DESKTOP = "120px"

/**
 * Fill `Layout` `MainContent` and bleed into its vertical padding so `HeroBackground` meets the
 * nav and footer (same values as `Layout.tsx` → `MainContent` padding-top / padding-bottom).
 */
const HomepageRoot = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  margin-top: calc(-1 * ${HERO_NAV_OFFSET_MOBILE});
  margin-bottom: calc(-1 * ${theme.spacing.xl});
  box-sizing: border-box;

  @media (min-width: 768px) {
    margin-top: calc(-1 * ${HERO_NAV_OFFSET_DESKTOP});
    margin-bottom: calc(-1 * ${theme.spacing["2xl"]});
  }
`

/** Full scroll height behind hero + modules; decorative layers use `position: absolute; inset: 0`. */
const HomepageCanvas = styled.div`
  position: relative;
  z-index: 0;
  flex: 1;
  width: 100%;
  min-height: 0;
  isolation: isolate;
`

const HomepageForeground = styled.div`
  position: relative;
  z-index: 1;
`

const HeroBand = styled.div`
  position: relative;
  z-index: 0;
  isolation: isolate;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: -${theme.spacing["2xl"]};
  padding-top: calc(${HERO_NAV_OFFSET_MOBILE} + ${theme.spacing.sm});
  padding-bottom: ${theme.spacing.xl};

  @media (min-width: 768px) {
    padding-top: calc(${HERO_NAV_OFFSET_DESKTOP} + ${theme.spacing.sm});
    padding-bottom: ${theme.spacing["2xl"]};
    margin-bottom: -${theme.spacing["3xl"]};
  }

  @media (min-width: 900px) {
    padding-top: calc(${HERO_NAV_OFFSET_DESKTOP} + ${theme.spacing.md});
  }
`

const HeroOrbField = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`

const HeroOrb = styled.div<{
  $left: string
  $top: string
  $delay: number
}>`
  position: absolute;
  left: ${(p) => p.$left};
  top: ${(p) => p.$top};
  width: min(58vmin, 440px);
  height: min(58vmin, 440px);
  border-radius: 50%;
  background: radial-gradient(
    circle at 32% 28%,
    rgba(0, 113, 227, 0.44) 0%,
    rgba(0, 113, 227, 0.1) 42%,
    transparent 68%
  );
  filter: blur(38px);
  opacity: 0.52;
  mix-blend-mode: multiply;
  animation: ${heroOrbDrift} 10s ease-in-out 1 forwards;
  animation-delay: ${(p) => p.$delay}s;
`

const HeroMain = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 42rem;

  @media (min-width: 900px) {
    max-width: 720px;
  }

  @media (prefers-reduced-motion: no-preference) {
    & > p:first-of-type {
      animation: ${heroEyebrowPulse} 3.2s ease-in-out 1 forwards;
    }

    & > h1 {
      background-image: linear-gradient(
        105deg,
        ${theme.colors.primary} 0%,
        ${theme.colors.blue[600]} 28%,
        ${theme.colors.blue[500]} 42%,
        ${theme.colors.primary} 58%,
        ${theme.colors.blue[700]} 72%,
        ${theme.colors.primary} 100%
      );
      background-size: 240% auto;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      animation: ${heroTitleFlow} 7s ease-in-out 1 forwards;
    }
  }
`

const moduleEntranceCss = (delay: string, phase: ModuleEntrancePhase) => css`
  @media (prefers-reduced-motion: no-preference) {
    ${phase === "hold" &&
    css`
      opacity: 0;
      transform: translate3d(0, 20px, 0);
    `}
    ${phase === "play" &&
    css`
      animation: ${homeModuleSlamIn} 0.55s ease-out both;
      animation-delay: ${delay};
    `}
    ${phase === "done" &&
    css`
      opacity: 1;
      transform: translate3d(0, 0, 0);
    `}
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    animation: none;
  }
`

/** Homepage content below hero: one full-width row, then bookshelf + stats in two columns on large screens. */
const HomepageModulesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.md};
  padding-top: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.xl};
  min-width: 0;
  width: 100%;

  @media (min-width: 480px) {
    gap: ${theme.spacing.lg};
  }

  @media (min-width: 768px) {
    padding-top: ${theme.spacing.xl};
    gap: ${theme.spacing.xl};
  }

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.88fr);
    grid-template-rows: auto 1fr;
    align-items: stretch;
  }
`

const HomepageModuleSpan = styled.div<{ $phase: ModuleEntrancePhase }>`
  min-width: 0;
  ${(p) => moduleEntranceCss("0.06s", p.$phase)}

  @media (min-width: 1024px) {
    grid-column: 1 / -1;
  }
`

const HomepageModuleBookshelf = styled.div<{ $phase: ModuleEntrancePhase }>`
  min-width: 0;
  ${(p) => moduleEntranceCss("0.16s", p.$phase)}

  @media (min-width: 1024px) {
    grid-column: 1;
    grid-row: 2;
  }
`

const HomepageModuleQuote = styled.div<{ $phase: ModuleEntrancePhase }>`
  min-width: 0;
  ${(p) => moduleEntranceCss("0.28s", p.$phase)}

  @media (min-width: 1024px) {
    grid-column: 1;
    grid-row: 3;
  }
`

const HomepageModuleStats = styled.div<{ $phase: ModuleEntrancePhase }>`
  min-width: 0;
  display: flex;
  flex-direction: column;
  ${(p) => moduleEntranceCss("0.36s", p.$phase)}

  @media (min-width: 1024px) {
    grid-column: 2;
    grid-row: 2 / span 2;

    > * {
      flex: 1;
      min-height: 0;
    }
  }
`

/**
 * Bookshelf: full-width title row, then stats + CTA (main) and “On the board” aside on large screens.
 */
const BookshelfSectionSplit = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    "header"
    "main"
    "aside";
  gap: ${theme.spacing.lg};
  align-items: stretch;
  min-width: 0;
  width: 100%;

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 1fr) minmax(11rem, 14rem);
    grid-template-areas:
      "header header"
      "main aside";
    /* row: title → cards; column: same as tile gutter + Insights grid (md) */
    gap: ${theme.spacing.lg} ${theme.spacing.md};
    align-items: start;
  }
`

const BookshelfSectionHeader = styled.div`
  grid-area: header;
  min-width: 0;
  text-align: left;

  /* Title → cards spacing comes from grid row-gap only (matches Insights column). */
  & > h2 {
    margin-bottom: 0;
  }
`

const BookshelfSectionMain = styled.div`
  grid-area: main;
  min-width: 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.md};

  a {
    margin-top: 0;
  }
`

const ShelfBookshelfSupporting = styled.div`
  max-width: 28rem;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};

  p {
    margin: 0;
    line-height: ${theme.lineHeights.lg};
  }
`

/** Search row: main + book-of-day column from ~900px (same rhythm as former search stats). */
const SectionSplit = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.lg};
  align-items: stretch;
  min-width: 0;
  width: 100%;

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 1fr) minmax(12rem, min(18.75rem, 40vw));
    gap: ${theme.spacing["2xl"]};
    align-items: center;
  }
`

const SectionSplitMain = styled.div`
  container-type: inline-size;
  min-width: 0;
  text-align: left;

  & > h2 {
    margin-bottom: ${theme.spacing.lg};
  }
`

const BookOfDayPanel = styled(ModuleInsetPanel).attrs({
  $tone: "neutral" as const,
  $size: "tile" as const,
})`
  width: 100%;
  min-width: 0;
  text-align: left;
`

const BookOfDayTitleLine = styled.p`
  margin: 0 0 ${theme.spacing.xs};
  font-size: ${theme.fontSizes.lg};
  line-height: ${theme.lineHeights.lg};
  min-width: 0;
`

const BookOfDayTitleLink = styled(Link)`
  display: inline;
  font-weight: ${theme.fontWeights.bold};
  letter-spacing: -0.02em;
  color: ${theme.colors.blue[500]};
  text-decoration: none;
  overflow-wrap: anywhere;
  word-break: break-word;

  &:hover {
    color: ${theme.colors.blue[600]};
    text-decoration: underline;
  }
`

const BookOfDayBy = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.secondary};
  font-weight: ${theme.fontWeights.normal};
  letter-spacing: normal;
  white-space: pre;
`

const BookOfDayAuthorLink = styled(Link)`
  display: inline;
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.blue[500]};
  text-decoration: none;
  overflow-wrap: anywhere;
  word-break: break-word;

  &:hover {
    color: ${theme.colors.blue[600]};
    text-decoration: underline;
  }
`

const BookOfDayMeta = styled.p`
  margin: ${theme.spacing.sm} 0 0;
  font-size: ${theme.fontSizes.xs};
  line-height: ${theme.lineHeights.sm};
  color: ${theme.colors.muted};
`

/* md gap above link matches bookshelf column stack (BookshelfSectionMain gap). */
const BrowseAllLink = styled(Link)`
  display: inline-block;
  position: relative;
  margin-top: ${theme.spacing.md};
  padding-bottom: 2px;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.blue[500]};
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.blue[700]};
  }

  @media (prefers-reduced-motion: no-preference) {
    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      border-radius: 2px;
      background: linear-gradient(
        90deg,
        transparent,
        ${theme.colors.blue[500]},
        ${theme.colors.blue[600]},
        ${theme.colors.blue[500]},
        transparent
      );
      background-size: 220% 100%;
      animation: ${linkShimmer} 2.2s linear 1 forwards;
      opacity: 0.9;
    }
  }
`

const SearchForm = styled.form`
  display: flex;
  gap: ${theme.spacing.sm};
  width: 100%;
  max-width: 640px;

  @media (max-width: 899px) {
    flex-direction: column;
    align-items: stretch;
    max-width: none;
  }
`

const ShelfMiniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${theme.spacing.md};
  margin: 0;
  width: 100%;
  max-width: none;
  min-width: 0;

  @media (max-width: 479px) {
    grid-template-columns: 1fr;
  }
`

const ShelfMiniCard = styled(ModuleInsetPanel).attrs({
  $tone: "neutral" as const,
  $size: "tile" as const,
})`
  text-align: center;
  min-width: 0;
`

const ShelfMiniValue = styled.div`
  font-size: clamp(${theme.fontSizes.xl}, 4vw, ${theme.fontSizes['2xl']});
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.primary};
  line-height: 1.2;
`

const ShelfMiniLabel = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.secondary};
  margin-top: ${theme.spacing.xs};
  line-height: ${theme.lineHeights.sm};
  word-break: normal;
  overflow-wrap: normal;
  text-wrap: balance;
`

const ShelfAside = styled(ModuleInsetPanel).attrs({
  as: "aside" as const,
  $tone: "neutral" as const,
  $size: "tile" as const,
})`
  grid-area: aside;
  width: 100%;
  min-width: 0;
`

/** Same level as dashboard inset titles (h3); compact type for the narrow aside. */
const ShelfAsideTitle = styled(Text).attrs({ variant: "h3" as const })`
  && {
    margin: 0 0 ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
    font-weight: ${theme.fontWeights.semibold};
    line-height: ${theme.lineHeights.lg};
    color: ${theme.colors.primary};
  }
`

const ShelfAsideList = styled.ul`
  margin: 0;
  padding-left: ${theme.spacing.lg};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeights.lg};
  color: ${theme.colors.secondary};

  li {
    margin-bottom: ${theme.spacing.xs};
  }

  li:last-child {
    margin-bottom: 0;
  }
`