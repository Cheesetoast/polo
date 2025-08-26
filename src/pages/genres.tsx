import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import Layout from '../components/Layout';
import { 
  getAllBookGenres,
  getAllAuthorGenres,
  getBooksByGenre,
  getAuthorsByGenre
} from '../utils/authorUtils';
import { BookLink } from '../components/BookLink';
import { AuthorLink } from '../components/AuthorLink';
import { GenreLink } from '../components/GenreLink';

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
    const genresWithBooks = combined.filter(genre => getBooksByGenre(genre).length > 0);
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
        case 'count':
          const aBookCount = getBooksByGenre(a).length;
          const bBookCount = getBooksByGenre(b).length;
          const aAuthorCount = getAuthorsByGenre(a).length;
          const bAuthorCount = getAuthorsByGenre(b).length;
          const aTotal = aBookCount + aAuthorCount;
          const bTotal = bBookCount + bAuthorCount;
          return bTotal - aTotal;
        case 'popularity':
          const aBookCount2 = getBooksByGenre(a).length;
          const bBookCount2 = getBooksByGenre(b).length;
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
    const books = getBooksByGenre(genre);
    const authors = getAuthorsByGenre(genre);
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
          <SearchInput
            type="text"
            placeholder="Search genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

            <ClearButton onClick={clearFilters}>
              Clear Filters
            </ClearButton>
          </FiltersRow>
        </FiltersContainer>

        {filteredGenres.length === 0 ? (
          <ResultsInfo>
            <p>No genres found matching your criteria.</p>
            <ClearButton onClick={clearFilters}>
              Clear All Filters
            </ClearButton>
          </ResultsInfo>
        ) : (
          <GenresGrid>
            {filteredGenres.map(genre => {
              const stats = getGenreStats(genre);
              const isBookGenre = bookGenres.includes(genre);
              const isAuthorGenre = authorGenres.includes(genre);
              
              return (
                <GenreCard
                  key={genre}
                  onClick={() => handleGenreClick(genre)}
                >
                  <GenreHeader>
                    <GenreName>
                      {genre}
                    </GenreName>
                    <GenreBadges>
                      {isBookGenre && <BookBadge>📚 Books</BookBadge>}
                      {isAuthorGenre && <AuthorBadge>✍️ Authors</AuthorBadge>}
                    </GenreBadges>
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
                          <AuthorLink key={author.id} authorName={author.name}>
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
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px;
  font-size: 1.1rem;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  margin-bottom: 24px;

  &:focus {
    border-color: #007bff;
  }
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

const ClearButton = styled.button`
  padding: 8px 16px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #4b5563;
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const GenreName = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  color: #111827;
  flex: 1;
`;

const GenreBadges = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const BookBadge = styled.span`
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const AuthorBadge = styled.span`
  background: #fef3c7;
  color: #92400e;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
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
