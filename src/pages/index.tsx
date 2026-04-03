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
import { useState, useMemo, useEffect } from "react"
import { useBookStatus } from "../hooks/useBookStatus"
import { navigate, Link } from "gatsby"
import styled, { css } from "styled-components"
import {
  heroEyebrowPulse,
  heroMeshChaos,
  heroOrbDrift,
  heroSheenSweep,
  heroTitleFlow,
  homeModuleSlamIn,
  linkShimmer,
  shelfTileWobble,
  statBlockSurge,
  statNumberSurge,
} from "../styles/motion"
import { rgba, theme } from "../styles/theme"
import { Button } from "../components/Button"
import { TextInput } from "../components/TextInput"
import { Eyebrow } from "../components/Eyebrow"
import { HomepageSection } from "../components/HomepageSection"
import { HomepageAuthorQuote } from "../components/HomepageAuthorQuote"
import { ModuleInsetPanel } from "../components/ModuleInsetPanel"

const BOOKS_DATA = booksData

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

  // Check localStorage on component mount
  useEffect(() => {
    if (MODAL_CONFIG.ENABLE_MODAL_DISMISS) {
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      console.log('Welcome modal check:', { hasSeenWelcome, showWelcomeModal });
      if (!hasSeenWelcome) {
        console.log('Setting modal to show');
        //setShowWelcomeModal(true);
      }
    } else {
      // If storage is disabled, always show the modal
      console.log('Modal storage disabled, showing modal');
      // setShowWelcomeModal(true);
    }
  }, []);

  const handleCloseWelcomeModal = () => {
    console.log('Closing welcome modal');
    setShowWelcomeModal(false);

    // Only store in localStorage if enabled
    if (MODAL_CONFIG.ENABLE_MODAL_DISMISS) {
      localStorage.setItem('hasSeenWelcome', 'true');
      console.log('Modal status stored in localStorage');
    } else {
      console.log('Modal status not stored (storage disabled)');
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
    const topGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
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
      <main>
        <HeroBand>
          <HeroBackground aria-hidden="true" />
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
            <HomepageModuleSpan>
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
                  <SearchStatPanel>
                    <SearchStatNumber>{books.length}</SearchStatNumber>
                    <SearchStatLabel>books in the catalog</SearchStatLabel>
                  </SearchStatPanel>
                </SectionSplit>
              </HomepageSection>
            </HomepageModuleSpan>

            <HomepageModuleBookshelf>
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

            <HomepageModuleQuote>
              <HomepageSection variant="prominent" inModuleGrid>
                <HomepageAuthorQuote />
              </HomepageSection>
            </HomepageModuleQuote>

            <HomepageModuleStats>
              <Dashboard stats={dashboardStats} fillHeight />
            </HomepageModuleStats>
          </HomepageModulesGrid>
        </ContentWrapper>

      </main>
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

const HeroBand = styled.div`
  position: relative;
  z-index: 0;
  isolation: isolate;
  box-sizing: border-box;
  width: 100%;
  margin-top: calc(-1 * ${HERO_NAV_OFFSET_MOBILE});
  margin-bottom: -${theme.spacing["2xl"]};
  padding-top: calc(${HERO_NAV_OFFSET_MOBILE} + ${theme.spacing.sm});
  padding-bottom: ${theme.spacing.xl};

  @media (min-width: 768px) {
    margin-top: calc(-1 * ${HERO_NAV_OFFSET_DESKTOP});
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

/** Animated mesh behind hero copy (decorative). */
const HeroBackground = styled.div`
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  background: ${theme.colors.background};

  &::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 150%;
    height: 150%;
    transform: translate(-50%, -50%);
    transform-origin: center center;
    background: radial-gradient(
        ellipse 58% 52% at 50% 44%,
        ${rgba.indigo(0.14)} 0%,
        transparent 58%
      ),
      radial-gradient(
        ellipse 42% 40% at 72% 38%,
        ${rgba.indigo(0.08)} 0%,
        transparent 55%
      ),
      radial-gradient(
        ellipse 48% 44% at 18% 62%,
        ${rgba.indigo(0.06)} 0%,
        transparent 52%
      ),
      radial-gradient(
        ellipse 50% 46% at 50% 56%,
        rgba(0, 0, 0, 0.05) 0%,
        transparent 54%
      );
    animation: ${heroMeshChaos} 6.5s ease-in-out 1 forwards;
    animation-delay: -0.85s;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      100deg,
      transparent 0%,
      ${rgba.indigo(0.02)} 18%,
      ${rgba.indigo(0.14)} 48%,
      rgba(255, 255, 255, 0.35) 52%,
      ${rgba.indigo(0.12)} 58%,
      transparent 82%,
      transparent 100%
    );
    background-size: 280% 100%;
    background-position: 0% 50%;
    animation: ${heroSheenSweep} 2.5s linear 1 forwards;
    animation-delay: -0.35s;
    opacity: 0.85;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
      transform: translate(-50%, -50%);
      opacity: 0.5;
    }

    &::after {
      animation: none;
      background-size: 100% 100%;
      background-position: center;
      opacity: 0.4;
    }
  }
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

const homeExtremeModule = (delay: string) => css`
  @media (prefers-reduced-motion: no-preference) {
    animation: ${homeModuleSlamIn} 1.05s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: ${delay};
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

const HomepageModuleSpan = styled.div`
  min-width: 0;
  ${homeExtremeModule("0.06s")};

  @media (min-width: 1024px) {
    grid-column: 1 / -1;
  }
`

const HomepageModuleBookshelf = styled.div`
  min-width: 0;
  ${homeExtremeModule("0.16s")};

  @media (min-width: 1024px) {
    grid-column: 1;
    grid-row: 2;
  }
`

const HomepageModuleQuote = styled.div`
  min-width: 0;
  ${homeExtremeModule("0.28s")};

  @media (min-width: 1024px) {
    grid-column: 1;
    grid-row: 3;
  }
`

const HomepageModuleStats = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  ${homeExtremeModule("0.36s")};

  @media (min-width: 1024px) {
    grid-column: 2;
    grid-row: 2 / span 2;

    > * {
      flex: 1;
      min-height: 0;
    }
  }
`

/** Search row: full content width, so two columns are safe from ~900px. */
const SectionSplit = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.lg};
  align-items: stretch;
  min-width: 0;
  width: 100%;

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 1fr) minmax(12rem, min(18.75rem, 40vw));
    gap: ${theme.spacing['2xl']};
    align-items: center;
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
    gap: ${theme.spacing.lg};
    align-items: start;
  }
`

const BookshelfSectionHeader = styled.div`
  grid-area: header;
  min-width: 0;
  text-align: left;

  /* Align with Search / Quote / Dashboard: space below module title */
  & > h2 {
    margin-bottom: ${theme.spacing.lg};
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

const SectionSplitMain = styled.div`
  container-type: inline-size;
  min-width: 0;
  text-align: left;

  & > h2 {
    margin-bottom: ${theme.spacing.lg};
  }
`

const SearchStatPanel = styled(ModuleInsetPanel).attrs({
  $tone: "accent" as const,
  $size: "well" as const,
})`
  width: 100%;
  min-width: 0;
  text-align: center;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${statBlockSurge} 2.8s ease-in-out 1 forwards;
    animation-delay: 0.5s;
  }
`

const SearchStatNumber = styled.div`
  font-size: clamp(${theme.fontSizes['3xl']}, 8vw, ${theme.fontSizes['5xl']});
  font-weight: ${theme.fontWeights.semibold};
  letter-spacing: -0.04em;
  color: ${theme.colors.primary};
  line-height: 1;
  overflow-wrap: anywhere;
  display: inline-block;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${statNumberSurge} 2.4s ease-in-out 1 forwards;
    animation-delay: 0.35s;
  }
`

const SearchStatLabel = styled.div`
  margin-top: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.secondary};
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
  gap: ${theme.spacing.sm};
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

  @media (prefers-reduced-motion: no-preference) {
    animation: ${shelfTileWobble} 3.8s ease-in-out 1 forwards;

    &:nth-child(1) {
      animation-delay: 0s;
    }

    &:nth-child(2) {
      animation-delay: -1.25s;
    }

    &:nth-child(3) {
      animation-delay: -2.5s;
    }
  }
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
  $size: "well" as const,
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