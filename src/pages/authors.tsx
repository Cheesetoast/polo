import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import { 
  getAllNationalities, 
  getAllAuthorGenres, 
  searchAuthors, 
  getAuthorsByNationality, 
  getAuthorsByGenre,
  getBooksByAuthor
} from '../utils/authorUtils';
import { Author } from '../utils/authorUtils';

const AuthorsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNationality, setSelectedNationality] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'nationality' | 'genre'>('name');

  // Get filter options
  const nationalities = getAllNationalities();
  const genres = getAllAuthorGenres();

  // Filter and search authors
  const filteredAuthors = useMemo(() => {
    let authors = searchAuthors(searchQuery);
    
    if (selectedNationality) {
      authors = getAuthorsByNationality(selectedNationality);
      if (searchQuery) {
        authors = authors.filter(author => 
          author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          author.bio?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    }
    
    if (selectedGenre) {
      authors = getAuthorsByGenre(selectedGenre);
      if (searchQuery || selectedNationality) {
        authors = authors.filter(author => {
          const matchesSearch = !searchQuery || 
            author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            author.bio?.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesNationality = !selectedNationality || author.nationality === selectedNationality;
          return matchesSearch && matchesNationality;
        });
      }
    }

    // Sort authors
    return authors.sort((a, b) => {
      switch (sortBy) {
        case 'nationality':
          return (a.nationality || '').localeCompare(b.nationality || '');
        case 'genre':
          const aGenres = a.genres.join(', ');
          const bGenres = b.genres.join(', ');
          return aGenres.localeCompare(bGenres);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [searchQuery, selectedNationality, selectedGenre, sortBy]);

  const handleAuthorClick = (authorId: string) => {
    navigate(`/author/${authorId}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedNationality('');
    setSelectedGenre('');
  };

  return (
    <PageContainer>
      <Header>
        <Title>Authors</Title>
        <Subtitle>
          Discover {filteredAuthors.length} authors and explore their works
        </Subtitle>
      </Header>

      <FiltersContainer>
        <SearchInput
          type="text"
          placeholder="Search authors by name, bio, or genre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <FiltersRow>
          <FilterGroup>
            <FilterLabel>Nationality:</FilterLabel>
            <FilterSelect
              value={selectedNationality}
              onChange={(e) => setSelectedNationality(e.target.value)}
            >
              <option value="">All Nationalities</option>
              {nationalities.map(nationality => (
                <option key={nationality} value={nationality}>{nationality}</option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Genre:</FilterLabel>
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

          <FilterGroup>
            <FilterLabel>Sort by:</FilterLabel>
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'nationality' | 'genre')}
            >
              <option value="name">Name</option>
              <option value="nationality">Nationality</option>
              <option value="genre">Genre</option>
            </FilterSelect>
          </FilterGroup>

          <ClearButton onClick={clearFilters}>
            Clear Filters
          </ClearButton>
        </FiltersRow>
      </FiltersContainer>

      {filteredAuthors.length === 0 ? (
        <ResultsInfo>
          <p>No authors found matching your criteria.</p>
          <ClearButton onClick={clearFilters}>
            Clear All Filters
          </ClearButton>
        </ResultsInfo>
      ) : (
        <AuthorsGrid>
          {filteredAuthors.map(author => (
            <AuthorCard
              key={author.id}
              onClick={() => handleAuthorClick(author.id)}
            >
                              <AuthorHeader>
                  <AuthorInfo>
                    <AuthorName>
                      {author.name}
                    </AuthorName>
                    {author.fullName !== author.name && (
                      <AuthorFullName>
                        {author.fullName}
                      </AuthorFullName>
                    )}
                    {author.birthYear && (
                      <AuthorYears>
                        {author.birthYear} - {author.deathYear || 'Present'}
                      </AuthorYears>
                    )}
                  </AuthorInfo>
                </AuthorHeader>

              {author.bio && (
                <AuthorBio>
                  {author.bio}
                </AuthorBio>
              )}

              {author.nationality && (
                <AuthorNationality>
                  {author.nationality}
                </AuthorNationality>
              )}

              {author.genres.length > 0 && (
                <GenresContainer>
                  {author.genres.slice(0, 3).map(genre => (
                    <GenreTag key={genre}>
                      {genre}
                    </GenreTag>
                  ))}
                  {author.genres.length > 3 && (
                    <MoreGenres>
                      +{author.genres.length - 3} more
                    </MoreGenres>
                  )}
                </GenresContainer>
              )}

              {(() => {
                const authorBooks = getBooksByAuthor(author.id);
                if (authorBooks.length > 0) {
                  return (
                    <BooksContainer>
                      <BooksLabel>
                        Books ({authorBooks.length}):
                      </BooksLabel>
                      <BooksList>
                        {authorBooks.slice(0, 3).map(book => (
                          <BookLink 
                            key={book.isbn}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/book/${book.isbn}`);
                            }}
                          >
                            {book.title}
                          </BookLink>
                        ))}
                        {authorBooks.length > 3 && (
                          <MoreBooks>
                            +{authorBooks.length - 3} more
                          </MoreBooks>
                        )}
                      </BooksList>
                    </BooksContainer>
                  );
                }
                return null;
              })()}
            </AuthorCard>
          ))}
        </AuthorsGrid>
      )}
    </PageContainer>
  );
};

export default AuthorsPage;

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

const AuthorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const AuthorCard = styled.div`
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

const AuthorHeader = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: flex-start;
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  color: #111827;
`;

const AuthorFullName = styled.p`
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  color: #6b7280;
  font-style: italic;
`;

const AuthorYears = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #9ca3af;
  font-weight: 500;
`;

const AuthorBio = styled.p`
  margin: 0 0 16px 0;
  line-height: 1.5;
  color: #6b7280;
  font-size: 0.9rem;
`;

const AuthorNationality = styled.p`
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  color: #9ca3af;
  font-weight: 500;
`;

const GenresContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
`;

const GenreTag = styled.span`
  background: #111827;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
`;

const MoreGenres = styled.span`
  color: #9ca3af;
  font-size: 0.8rem;
  font-style: italic;
`;

const BooksContainer = styled.div`
  margin-bottom: 0;
`;

const BooksLabel = styled.span`
  font-weight: 600;
  color: #6b7280;
  font-size: 0.9rem;
  margin-right: 8px;
`;

const BooksList = styled.span`
  display: inline;
`;

const BookLink = styled.span`
  color: #007bff;
  font-size: 0.9rem;
  margin-right: 8px;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #0056b3;
  }
`;

const MoreBooks = styled.span`
  color: #9ca3af;
  font-size: 0.8rem;
  font-style: italic;
`;
