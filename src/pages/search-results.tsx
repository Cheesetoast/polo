import type { HeadFC, PageProps } from "gatsby"
import { useLocation } from "@gatsbyjs/reach-router"
import { navigate } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Text } from "../components/Text"
import { ContentWrapper } from "../components/ContentWrapper"
import { SITE_CONFIG } from "../constants"
import { BookTable } from "../components/BookTable"
import { useBookStatus } from "../hooks/useBookStatus"
import booksData from "../data/books.json"
import { useState, useMemo, useEffect, useCallback } from "react"
import { Button } from "../components/Button"
import styled from "styled-components"
import { theme } from "../styles/theme"

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

const SearchResultsPage = () => {
  const location = useLocation();
  const books: Book[] = booksData;
  const { booksWithStatus } = useBookStatus(books);
  
  // Parse URL parameters with SSR safety
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
  const urlAuthor = urlParams.get('author') || '';
  const urlSearch = urlParams.get('search') || '';
  const urlGenre = urlParams.get('genre') || '';

  // Initialize state from URL parameters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");

  // Set initial state from URL parameters after mount (prevents hydration mismatch)
  useEffect(() => {
    setSearchQuery(urlSearch);
    setDebouncedSearchQuery(urlSearch);
    setSelectedGenre(urlGenre);
    setSelectedAuthor(urlAuthor);
  }, [urlSearch, urlGenre, urlAuthor]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL when filters change (debounced for search)
  useEffect(() => {
    // Skip the initial render to avoid conflicts with URL parameters
    const isInitialRender = 
      debouncedSearchQuery === urlSearch &&
      selectedGenre === urlGenre &&
      selectedAuthor === urlAuthor;
    
    if (isInitialRender) return;

    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set('search', debouncedSearchQuery);
    if (selectedGenre) params.set('genre', selectedGenre);
    if (selectedAuthor) params.set('author', selectedAuthor);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/search-results';
    window.history.replaceState({}, '', newUrl);
  }, [debouncedSearchQuery, selectedGenre, selectedAuthor, urlSearch, urlGenre, urlAuthor]);

  // Get unique genres for filters
  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(books.map(book => book.genre).filter(Boolean))];
    return uniqueGenres.sort();
  }, [books]);



  // Filter books based on search criteria
  const filteredBooks = useMemo(() => {
    return booksWithStatus.filter(book => {
      const matchesSearch = debouncedSearchQuery === "" || 
        book.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        book.description.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesGenre = selectedGenre === "" || book.genre === selectedGenre;
      const matchesAuthor = selectedAuthor === "" || book.author === selectedAuthor;

      return matchesSearch && matchesGenre && matchesAuthor;
    });
  }, [booksWithStatus, debouncedSearchQuery, selectedGenre, selectedAuthor]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("");
    setSelectedAuthor("");
  };

  const handleAuthorClick = (authorName: string) => {
    // Clear other filters when clicking on an author
    setSearchQuery("");
    setSelectedGenre("");
    setSelectedAuthor(authorName);
  };

  const handleBookClick = (book: any) => {
    // Navigate to book detail page
    navigate(`/book/${book.isbn.replace(/-/g, '')}`);
  };

  // Generate page title based on filters
  const getPageTitle = () => {
    if (selectedAuthor) {
      return `Books by ${selectedAuthor}`;
    }
    if (debouncedSearchQuery) {
      return `Search results for "${debouncedSearchQuery}"`;
    }
    if (selectedGenre) {
      return `Books in ${selectedGenre}`;
    }
    return "Search Results";
  };

  return (
    <Layout>
      <main>
        <ContentWrapper>
          <div>
            <Text variant="h1">{getPageTitle()}</Text>
            <Text variant="p" color="secondary">
              {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
            </Text>
          </div>

          <SearchContainer>
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
                onClick={handleClearFilters} 
                variant="outline" 
                size="small"
              >
                Clear Filters
              </Button>
            </FiltersContainer>
          </SearchContainer>

          <BookTable 
            books={filteredBooks} 
            onBookClick={handleBookClick}
            onAuthorClick={handleAuthorClick}
            pageSize={10}
          />

        </ContentWrapper>
      </main>
    </Layout>
  )
}

export default SearchResultsPage

export const Head: HeadFC = () => (
  <SEO
    title={`Search Results - ${SITE_CONFIG.SITE_NAME}`}
    description="Search and filter through our book collection."
    keywords={['books', 'search', 'filter', 'reading', 'library']}
  />
)

// Styled Components
const SearchContainer = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.md};
  margin-bottom: ${theme.spacing.md};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const FilterSelect = styled.select`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;
