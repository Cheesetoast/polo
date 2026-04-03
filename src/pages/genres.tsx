import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import Layout from '../components/Layout';
import { 
  getAllBookGenres,
  getAllAuthorGenres,
  resolveGenreBooks,
  getBookAuthorSummariesFromBooks
} from '../utils/authorUtils';
import { BookLink } from '../components/BookLink';
import { AuthorLink } from '../components/AuthorLink';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { panelFilters } from '../styles/surfaceStyles';

const GenresPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'books' | 'authors'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'count' | 'popularity'>('name');

  // Get all genres from both books and authors
  const bookGenres = getAllBookGenres();
  const authorGenres = getAllAuthorGenres();
  
  // Combine and deduplicate genres, but only include genres that have books
  const allGenres = useMemo(() => {
    const combined = [...new Set([...bookGenres, ...authorGenres])];
    // Filter to only include genres that have books
    const genresWithBooks = combined.filter(
      genre => resolveGenreBooks(genre).books.length > 0
    );
    return genresWithBooks.sort();
  }, [bookGenres, authorGenres]);

  // Filter and search genres
  const filteredGenres = useMemo(() => {
    let genres = allGenres;
    
    // Filter by search query
    if (searchQuery) {
      genres = genres.filter(genre => 
        genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory === 'books') {
      genres = genres.filter(genre => bookGenres.includes(genre));
    } else if (selectedCategory === 'authors') {
      genres = genres.filter(genre => authorGenres.includes(genre));
    }

    // Sort genres
    return genres.sort((a, b) => {
      switch (sortBy) {
        case 'count': {
          const aResolved = resolveGenreBooks(a);
          const bResolved = resolveGenreBooks(b);
          const aBookCount = aResolved.books.length;
          const bBookCount = bResolved.books.length;
          const aAuthorCount = getBookAuthorSummariesFromBooks(
            aResolved.books
          ).length;
          const bAuthorCount = getBookAuthorSummariesFromBooks(
            bResolved.books
          ).length;
          const aTotal = aBookCount + aAuthorCount;
          const bTotal = bBookCount + bAuthorCount;
          return bTotal - aTotal;
        }
        case 'popularity':
          const aBookCount2 = resolveGenreBooks(a).books.length;
          const bBookCount2 = resolveGenreBooks(b).books.length;
          return bBookCount2 - aBookCount2;
        default:
          return a.localeCompare(b);
      }
    });
  }, [searchQuery, selectedCategory, sortBy, allGenres, bookGenres, authorGenres]);

  const handleGenreClick = (genre: string) => {
    const encodedGenre = encodeURIComponent(genre);
    navigate(`/genre/${encodedGenre}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const getGenreStats = (genre: string) => {
    const { books } = resolveGenreBooks(genre);
    const authors = getBookAuthorSummariesFromBooks(books);
    return { books, authors };
  };

  return (
    <Layout>
      <PageContainer>
        <Header>
          <Title>Genres</Title>
          <Subtitle>
            Explore {filteredGenres.length} genres that have books in our collection
          </Subtitle>
        </Header>

        <FiltersContainer>
          <TextInput
            type="text"
            placeholder="Search genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            marginBottom="lg"
          />

          <FiltersRow>
            <FilterGroup>
              <FilterLabel>Category:</FilterLabel>
              <FilterSelect
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as 'all' | 'books' | 'authors')}
              >
                <option value="all">All Genres (with books)</option>
                <option value="books">Book Genres</option>
                <option value="authors">Author Genres (with books)</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Sort by:</FilterLabel>
              <FilterSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'count' | 'popularity')}
              >
                <option value="name">Name</option>
                <option value="count">Total Count</option>
                <option value="popularity">Book Popularity</option>
              </FilterSelect>
            </FilterGroup>

            <Button type="button" variant="secondary" size="small" onClick={clearFilters}>
              Clear Filters
            </Button>
          </FiltersRow>
        </FiltersContainer>

        {filteredGenres.length === 0 ? (
          <ResultsInfo>
            <p>No genres found matching your criteria.</p>
            <Button type="button" variant="secondary" size="small" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </ResultsInfo>
        ) : (
          <GenresGrid>
            {filteredGenres.map(genre => {
              const stats = getGenreStats(genre);

              return (
                <GenreCard
                  key={genre}
                  onClick={() => handleGenreClick(genre)}
                >
                  <GenreHeader>
                    <GenreName>{genre}</GenreName>
                  </GenreHeader>

                  <GenreStats>
                    <StatItem>
                      <StatLabel>Books:</StatLabel>
                      <StatValue>{stats.books.length}</StatValue>
                    </StatItem>
                    <StatItem>
                      <StatLabel>Authors:</StatLabel>
                      <StatValue>{stats.authors.length}</StatValue>
                    </StatItem>
                  </GenreStats>

                  {stats.books.length > 0 && (
                    <SampleBooks>
                      <SampleLabel>Sample Books:</SampleLabel>
                      <SampleList>
                        {stats.books.slice(0, 3).map(book => (
                          <BookLink 
                            key={book.isbn}
                            isbn={book.isbn}
                          >
                            {book.title}
                          </BookLink>
                        ))}
                        {stats.books.length > 3 && (
                          <MoreItems>
                            +{stats.books.length - 3} more
                          </MoreItems>
                        )}
                      </SampleList>
                    </SampleBooks>
                  )}

                  {stats.authors.length > 0 && (
                    <SampleAuthors>
                      <SampleLabel>Sample Authors:</SampleLabel>
                      <SampleList>
                        {stats.authors.slice(0, 3).map(author => (
                          <AuthorLink key={author.key} authorName={author.name}>
                            {author.name}
                          </AuthorLink>
                        ))}
                        {stats.authors.length > 3 && (
                          <MoreItems>
                            +{stats.authors.length - 3} more
                          </MoreItems>
                        )}
                      </SampleList>
                    </SampleAuthors>
                  )}
                </GenreCard>
              );
            })}
          </GenresGrid>
        )}
      </PageContainer>
    </Layout>
  );
};

export default GenresPage;

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 0 0 16px 0;
  color: #111827;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #6b7280;
  margin: 0;
`;

const FiltersContainer = styled.div`
  margin-bottom: 32px;
  padding: 24px;
  ${panelFilters}
`;

const FiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #6b7280;
  font-size: 0.9rem;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  outline: none;

  &:focus {
    border-color: #007bff;
  }
`;

const ResultsInfo = styled.div`
  text-align: center;
  padding: 48px;
  color: #6b7280;
`;

const GenresGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const GenreCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  background: white;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const GenreHeader = styled.div`
  margin-bottom: 16px;
`;

const GenreName = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  color: #111827;
`;

const GenreStats = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const StatLabel = styled.span`
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

const SampleBooks = styled.div`
  margin-bottom: 16px;
`;

const SampleAuthors = styled.div`
  margin-bottom: 0;
`;

const SampleLabel = styled.span`
  font-weight: 600;
  color: #6b7280;
  font-size: 0.9rem;
  margin-right: 8px;
`;

const SampleList = styled.span`
  display: inline;
`;

const MoreItems = styled.span`
  color: #9ca3af;
  font-size: 0.8rem;
  font-style: italic;
`;
