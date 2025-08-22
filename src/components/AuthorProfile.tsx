import React from 'react';
import styled from 'styled-components';
import { Author, getBooksByAuthor } from '../utils/authorUtils';
import { Book } from './Book';

interface AuthorProfileProps {
  author: Author;
}

export const AuthorProfile = ({ author }: AuthorProfileProps) => {
  const authorBooks = getBooksByAuthor(author.id);

  return (
    <AuthorContainer>
      <AuthorHeader>
        {author.image && <AuthorImage src={author.image} alt={author.name} />}
        <AuthorInfo>
          <AuthorName>{author.name}</AuthorName>
          {author.fullName !== author.name && (
            <FullName>{author.fullName}</FullName>
          )}
          {author.birthYear && (
            <Lifespan>
              {author.birthYear} - {author.deathYear || 'Present'}
            </Lifespan>
          )}
          {author.nationality && <Nationality>{author.nationality}</Nationality>}
        </AuthorInfo>
      </AuthorHeader>

      {author.bio && (
        <BioSection>
          <h3>Biography</h3>
          <p>{author.bio}</p>
        </BioSection>
      )}

      {author.genres.length > 0 && (
        <GenresSection>
          <h3>Genres</h3>
          <GenreTags>
            {author.genres.map(genre => (
              <GenreTag key={genre}>{genre}</GenreTag>
            ))}
          </GenreTags>
        </GenresSection>
      )}

      {author.notableWorks.length > 0 && (
        <NotableWorksSection>
          <h3>Notable Works</h3>
          <ul>
            {author.notableWorks.map(work => (
              <li key={work}>{work}</li>
            ))}
          </ul>
        </NotableWorksSection>
      )}

      <BooksSection>
        <h3>Books ({authorBooks.length})</h3>
        <BooksGrid>
          {authorBooks.map(book => (
            <Book key={book.isbn} book={book} onClick={() => {}} />
          ))}
        </BooksGrid>
      </BooksSection>

      {author.website && (
        <WebsiteSection>
          <h3>Website</h3>
          <WebsiteLink href={author.website} target="_blank" rel="noopener noreferrer">
            Visit {author.name}'s website
          </WebsiteLink>
        </WebsiteSection>
      )}
    </AuthorContainer>
  );
};

// Styled Components
const AuthorContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const AuthorHeader = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  align-items: flex-start;
`;

const AuthorImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.h1`
  margin: 0 0 8px 0;
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const FullName = styled.p`
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.secondary};
  font-style: italic;
`;

const Lifespan = styled.p`
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const Nationality = styled.p`
  margin: 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const BioSection = styled.section`
  margin-bottom: 32px;
  
  h3 {
    margin: 0 0 16px 0;
    color: ${({ theme }) => theme.colors.primary};
  }
  
  p {
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const GenresSection = styled.section`
  margin-bottom: 32px;
  
  h3 {
    margin: 0 0 16px 0;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const GenreTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const GenreTag = styled.span`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
`;

const NotableWorksSection = styled.section`
  margin-bottom: 32px;
  
  h3 {
    margin: 0 0 16px 0;
    color: ${({ theme }) => theme.colors.primary};
  }
  
  ul {
    margin: 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const BooksSection = styled.section`
  margin-bottom: 32px;
  
  h3 {
    margin: 0 0 16px 0;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const WebsiteSection = styled.section`
  margin-bottom: 32px;
  
  h3 {
    margin: 0 0 16px 0;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const WebsiteLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;
