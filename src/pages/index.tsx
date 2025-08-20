import type { HeadFC, PageProps } from "gatsby"
import { useStaticQuery, graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Text } from "../components/Text"
import { ContentWrapper } from "../components/ContentWrapper"
import { SITE_CONFIG } from "../constants"
import { Dashboard } from "../components/Dashboard"
import { calculateYearInBooksStats } from "../utils/yearInBooksStats"
import booksData from "../data/books.json"
import { useState } from "react"
import { navigate } from "gatsby"
import styled from "styled-components"
import { theme } from "../styles/theme"
import { Button } from "../components/Button"

interface Book {
  title: string;
  author: string;
  description: {
    description: string;
  };
  image?: {
    gatsbyImageData: any;
    title?: string;
  } | null;
  isbn: string;
  communityRating?: number;
  userRating?: number;
  genre?: string;
  progress?: number;
  dateStarted?: string | null;
  dateFinished?: string | null;
  pages?: number;
}

const IndexPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
  const books: Book[] = booksData;

  // Calculate dashboard statistics
  const totalBooks = books.length;
  const finishedBooks = books.filter(book => book.dateFinished).length;
  const currentlyReading = books.filter(book => book.progress && book.progress > 0 && book.progress < 100).length;
  const wantToRead = books.filter(book => !book.dateStarted && !book.dateFinished).length;

  // Calculate top genres
  const genreCounts: Record<string, number> = {};
  books.forEach(book => {
    if (book.genre) {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    }
  });
  const topGenres = Object.entries(genreCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([genre]) => genre);

  // Calculate average rating (use user rating if available, otherwise community rating)
  const booksWithRatings = books.filter(book => book.userRating !== undefined || book.communityRating !== undefined);
  const averageRating = booksWithRatings.length > 0
    ? (booksWithRatings.reduce((sum, book) => {
        // Prefer user rating if available, otherwise use community rating
        const rating = book.userRating !== undefined ? book.userRating : (book.communityRating || 0);
        return sum + rating;
      }, 0) / booksWithRatings.length).toFixed(1)
    : '0.0';



  // Calculate year-in-books statistics
  const yearInBooksStats = calculateYearInBooksStats(books);

  const dashboardStats = {
    totalBooks,
    finishedBooks,
    currentlyReading,
    wantToRead,
    topGenres,
    averageRating
  };

  return (
    <Layout>
      <main>
        <ContentWrapper>
          <div>
            <Text variant="h1">
              {homepageTitle || SITE_CONFIG.SITE_NAME}
            </Text>
          </div>

          <HomepageSearchSection>
            <Text variant="h2" align="center">
              Find Your Next Great Read
            </Text>
            <Text variant="p" color="secondary" align="center">
              Search through our collection of books by title, author, or description
            </Text>
            
            <SearchForm onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate(`/search-results?search=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}>
              <SearchInput
                type="text"
                placeholder="Search by title, author, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchButton type="submit">
                Search
              </SearchButton>
            </SearchForm>
          </HomepageSearchSection>

          <BookshelfSection>
            <Text variant="h2" align="center">
              Organize Your Reading
            </Text>
            <Text variant="p" color="secondary" align="center">
              Use our visual Kanban board to track your reading progress and organize your bookshelf
            </Text>
            <Button onClick={() => navigate('/bookshelf')} variant="primary" size="large">
              View My Bookshelf
            </Button>
          </BookshelfSection>

          <Dashboard stats={dashboardStats} yearInBooksStats={yearInBooksStats} />

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

// Styled Components
const HomepageSearchSection = styled.section`
  text-align: center;
  margin: ${theme.spacing.xl} 0;
  padding: ${theme.spacing.xl};
  background: linear-gradient(135deg, ${theme.colors.primary}05 0%, ${theme.colors.primary}10 100%);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.primary}10;
`;

const SearchForm = styled.form`
  display: flex;
  gap: ${theme.spacing.md};
  max-width: 600px;
  margin: ${theme.spacing.lg} auto 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base};
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${theme.colors.muted};
  }
`;

const SearchButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${theme.colors.primary}dd;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${theme.colors.primary}40;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const BookshelfSection = styled.section`
  text-align: center;
  margin: ${theme.spacing.xl} 0;
  padding: ${theme.spacing.xl};
  background: linear-gradient(135deg, ${theme.colors.secondary}05 0%, ${theme.colors.secondary}10 100%);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.secondary}10;
`;