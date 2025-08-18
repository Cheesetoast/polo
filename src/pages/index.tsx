import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Button } from "../components/Button"
import { Text } from "../components/Text"
import { ContentWrapper } from "../components/ContentWrapper"
import { SITE_CONFIG } from "../constants"
import { BookBoardContainer } from "../components/BookBoardContainer"
import { ButtonContainer } from "../components/ButtonContainer"
import { Dashboard } from "../components/Dashboard"
import { calculateYearInBooksStats } from "../utils/yearInBooksStats"
import booksData from "../data/books.json"

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
  type?: string;
  pages?: number;
}

const IndexPage = () => {
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

  // Calculate type counts
  const typeCounts: Record<string, number> = {};
  books.forEach(book => {
    if (book.type) {
      typeCounts[book.type] = (typeCounts[book.type] || 0) + 1;
    }
  });

  // Calculate year-in-books statistics
  const yearInBooksStats = calculateYearInBooksStats(books);

  const dashboardStats = {
    totalBooks,
    finishedBooks,
    currentlyReading,
    wantToRead,
    topGenres,
    averageRating,
    typeCounts
  };

  return (
    <Layout>
      <main>
        <ContentWrapper>
          <div>
            <Text variant="h1">
              {SITE_CONFIG.SITE_NAME}
            </Text>
          </div>

          <ButtonContainer alignment="start">
            <Button>Click me</Button>
          </ButtonContainer>

          <Dashboard stats={dashboardStats} yearInBooksStats={yearInBooksStats} />

          <BookBoardContainer books={books} title="My Reading List" />

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