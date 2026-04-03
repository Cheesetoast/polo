import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Text } from "../components/Text"
import { ContentWrapper } from "../components/ContentWrapper"
import { SITE_CONFIG } from "../constants"
import { BookTable } from "../components/BookTable"
import booksData from "../data/books.json"
import { useState, useMemo } from "react"
import { Button } from "../components/Button"
import { TextInput } from "../components/TextInput"
import styled from "styled-components"
import { theme } from "../styles/theme"
import { panelElevated } from "../styles/surfaceStyles"
import { navigate } from "gatsby"

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
  userRating?: number | null;
  genres?: string[];
  progress?: number;
  pages?: number;
}

const SearchPage = () => {
  const books: Book[] = booksData;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  
  // Ensure books data is available before rendering
  const isDataReady = books && books.length > 0;

  // Get unique genres and authors for filters
  const genres = useMemo(() => {
    if (!books || books.length === 0) return [];
    const allGenres = books.flatMap(book => book.genres || []).filter(Boolean);
    const uniqueGenres = [...new Set(allGenres)];
    return uniqueGenres.sort();
  }, [books]);

  const authors = useMemo(() => {
    if (!books || books.length === 0) return [];
    const uniqueAuthors = [...new Set(books.map(book => book.author).filter(Boolean))];
    return uniqueAuthors.sort();
  }, [books]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("");
  };



  return (
    <Layout>
      <main>
        <ContentWrapper>
          <div>
            <Text variant="h1">Search Books</Text>
            <Text variant="p" color="secondary">
              Find your next great read from our collection
            </Text>
          </div>

          {isDataReady && (
            <SearchForm onSubmit={(e) => {
              e.preventDefault();
              const params = new URLSearchParams();
              if (searchQuery) params.set('search', searchQuery);
              if (selectedGenre) params.set('genre', selectedGenre);
              
              const queryString = params.toString();
              navigate(`/search-results${queryString ? `?${queryString}` : ''}`);
            }}>
              <TextInput
                type="text"
                placeholder="Search by title, author, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                marginBottom="md"
              />
              
              <FiltersContainer>
                <FilterGroup>
                  <Text variant="caption" weight="medium">Genre:</Text>
                  <FilterSelect
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                  >
                    <option value="">All Genres</option>
                    {genres && genres.length > 0 && genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </FilterSelect>
                </FilterGroup>

                <Button 
                  type="submit"
                  variant="primary"
                  size="small"
                >
                  Search
                </Button>

                <Button 
                  onClick={handleClearFilters} 
                  variant="outline" 
                  size="small"
                  type="button"
                >
                  Clear Filters
                </Button>
              </FiltersContainer>
            </SearchForm>
          )}

          {isDataReady && (
            <QuickSearchSection>
              <Text variant="h3">Quick Search</Text>
              <Text variant="p" color="secondary">Click on any author name to see all their books</Text>
              
              <AuthorsGrid>
                {authors && authors.length > 0 && authors.slice(0, 12).map(author => (
                  <Button
                    key={author}
                    type="button"
                    variant="muted"
                    size="small"
                    fullWidth
                    contentAlign="start"
                    onClick={() => navigate(`/search-results?author=${encodeURIComponent(author)}`)}
                  >
                    {author}
                  </Button>
                ))}
              </AuthorsGrid>
            </QuickSearchSection>
          )}

        </ContentWrapper>
      </main>
    </Layout>
  )
}

export default SearchPage

export const Head: HeadFC = () => (
  <SEO
    title={`Search - ${SITE_CONFIG.SITE_NAME}`}
    description="Search our collection of books by title, author, genre, and more."
    keywords={['search', 'books', 'library', 'reading', 'find books']}
  />
)

// Styled Components
const SearchForm = styled.form`
  margin: ${theme.spacing.xl} 0;
  padding: ${theme.spacing.lg};
  ${panelElevated}
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: flex-end;
  flex-wrap: wrap;
  margin-bottom: ${theme.spacing.md};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const FilterSelect = styled.select`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  background: white;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const QuickSearchSection = styled.div`
  margin-top: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  ${panelElevated}
`;

const AuthorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;
