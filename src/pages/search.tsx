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
import styled from "styled-components"
import { theme } from "../styles/theme"
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

  // Get unique genres and authors for filters
  const genres = useMemo(() => {
    const allGenres = books.flatMap(book => book.genres || []).filter(Boolean);
    const uniqueGenres = [...new Set(allGenres)];
    return uniqueGenres.sort();
  }, [books]);

  const authors = useMemo(() => {
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

          <SearchForm onSubmit={(e) => {
            e.preventDefault();
            const params = new URLSearchParams();
            if (searchQuery) params.set('search', searchQuery);
            if (selectedGenre) params.set('genre', selectedGenre);
            
            const queryString = params.toString();
            navigate(`/search-results${queryString ? `?${queryString}` : ''}`);
          }}>
            <SearchInput
              type="text"
              placeholder="Search by title, author, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <FiltersContainer>
              <FilterGroup>
                <Text variant="caption" weight="medium">Genre:</Text>
                <FilterSelect
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
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

          <QuickSearchSection>
            <Text variant="h3">Quick Search</Text>
            <Text variant="p" color="secondary">Click on any author name to see all their books</Text>
            
            <AuthorsGrid>
              {authors.slice(0, 12).map(author => (
                <AuthorButton
                  key={author}
                  onClick={() => navigate(`/search-results?author=${encodeURIComponent(author)}`)}
                >
                  {author}
                </AuthorButton>
              ))}
            </AuthorsGrid>
          </QuickSearchSection>

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
  background: white;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.muted};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base};
  margin-bottom: ${theme.spacing.md};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
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
  background: white;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.muted};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AuthorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;

const AuthorButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.md};
  background-color: white;
  color: ${theme.colors.gray?.[600] || '#374151'};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    background-color: ${theme.colors.primary};
    color: white;
    border-color: ${theme.colors.primary};
  }
`;
