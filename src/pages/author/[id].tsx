import React from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import { getAuthorById, getBooksByAuthor } from '../../utils/authorUtils';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import { Book } from '../../components/Book';
import { Button } from '../../components/Button';
import { theme } from '../../styles/theme';

interface AuthorPageProps {
  params: {
    id: string;
  };
}

const AuthorPage = ({ params }: AuthorPageProps) => {
  const author = getAuthorById(params.id);
  const authorBooks = getBooksByAuthor(params.id);

  if (!author) {
    return (
      <Layout>
        <SEO title="Author Not Found" description="The requested author could not be found" />
        <NotFoundContainer>
          <NotFoundTitle>Author Not Found</NotFoundTitle>
          <NotFoundText>The author you're looking for doesn't exist.</NotFoundText>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/authors')}
            style={{ marginBottom: theme.spacing.lg }}
          >
            Back to Authors
          </Button>
        </NotFoundContainer>
      </Layout>
    );
  }

  const handleBookClick = (book: any) => {
    navigate(`/book/${book.isbn.replace(/-/g, '')}`);
  };

  const handleBackToAuthors = () => {
    navigate('/authors');
  };

  return (
    <Layout>
      <SEO 
        title={`${author.name} - Author`} 
        description={author.bio || `Explore books by ${author.name}`} 
      />
              <PageContainer>
        <Button
          type="button"
          variant="ghost"
          onClick={handleBackToAuthors}
          style={{ marginBottom: theme.spacing.lg }}
        >
          ← Back to Authors
        </Button>

        <AuthorHeader>
          <AuthorImageSection>
            {author.image ? (
              <AuthorImage src={author.image} alt={author.name} />
            ) : (
              <AuthorPlaceholder>
                {author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AuthorPlaceholder>
            )}
          </AuthorImageSection>

          <AuthorInfoSection>
            <AuthorName>{author.name}</AuthorName>
            {author.fullName !== author.name && (
              <AuthorFullName>{author.fullName}</AuthorFullName>
            )}
            
            <AuthorMeta>
              {author.birthYear && (
                <MetaItem>
                  <MetaLabel>Born:</MetaLabel>
                  <MetaValue>
                    {author.birthYear}
                    {author.deathYear && ` - ${author.deathYear}`}
                  </MetaValue>
                </MetaItem>
              )}
              
              {author.nationality && (
                <MetaItem>
                  <MetaLabel>Nationality:</MetaLabel>
                  <MetaValue>{author.nationality}</MetaValue>
                </MetaItem>
              )}
            </AuthorMeta>

            {author.website && (
              <AuthorWebsite>
                <WebsiteLink 
                  href={author.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Visit Website
                </WebsiteLink>
              </AuthorWebsite>
            )}
          </AuthorInfoSection>
        </AuthorHeader>

        {author.bio && (
          <BioSection>
            <SectionTitle>Biography</SectionTitle>
            <BioText>{author.bio}</BioText>
          </BioSection>
        )}

        {author.genres.length > 0 && (
          <GenresSection>
            <SectionTitle>Genres</SectionTitle>
            <GenresList>
              {author.genres.map(genre => (
                <GenreTag 
                  key={genre}
                  onClick={() => navigate(`/genre/${encodeURIComponent(genre)}`)}
                >
                  {genre}
                </GenreTag>
              ))}
            </GenresList>
          </GenresSection>
        )}



        <BooksSection>
          <SectionTitle>
            Books by {author.name} ({authorBooks.length})
          </SectionTitle>
          
          {authorBooks.length === 0 ? (
            <NoBooks>
              <NoBooksText>No books found for this author.</NoBooksText>
            </NoBooks>
          ) : (
            <BooksGrid>
              {authorBooks.map(book => (
                <BookCard 
                  key={book.isbn} 
                  onClick={() => handleBookClick(book)}
                >
                  <BookTitle>{book.title}</BookTitle>
                  <BookAuthor>{book.author}</BookAuthor>
                  {book.description && (
                    <BookDescription>{book.description.description}</BookDescription>
                  )}
                </BookCard>
              ))}
            </BooksGrid>
          )}
        </BooksSection>
      </PageContainer>
    </Layout>
  );
};

export default AuthorPage;

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 48px;
  max-width: 600px;
  margin: 0 auto;
`;

const NotFoundTitle = styled.h1`
  font-size: 2.5rem;
  color: ${theme.colors.secondary};
  margin: 0 0 16px 0;
`;

const NotFoundText = styled.p`
  font-size: 1.2rem;
  color: ${theme.colors.secondary};
  margin: 0 0 24px 0;
`;

const AuthorHeader = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 48px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const AuthorImageSection = styled.div`
  flex-shrink: 0;
`;

const AuthorImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
`;

const AuthorPlaceholder = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: ${theme.colors.blue[500]};
  color: ${theme.colors.ink};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
`;

const AuthorInfoSection = styled.div`
  flex: 1;
`;

const AuthorName = styled.h1`
  font-size: 3rem;
  margin: 0 0 16px 0;
  color: ${theme.colors.blue[500]};

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const AuthorFullName = styled.p`
  font-size: 1.3rem;
  color: ${theme.colors.secondary};
  margin: 0 0 24px 0;
  font-style: italic;
`;

const AuthorMeta = styled.div`
  margin-bottom: 24px;
`;

const MetaItem = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  align-items: center;
`;

const MetaLabel = styled.span`
  font-weight: 600;
  color: ${theme.colors.secondary};
  min-width: 100px;
`;

const MetaValue = styled.span`
  color: ${theme.colors.secondary};
`;

const AuthorWebsite = styled.div`
  margin-top: 16px;
`;

const WebsiteLink = styled.a`
  display: inline-block;
  background: ${theme.colors.accent};
  color: ${theme.colors.ink};
  padding: 12px 24px;
  border-radius: ${theme.borderRadius.md};
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: ${theme.colors.blue[600]};
  }
`;

const BioSection = styled.section`
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${theme.colors.blue[500]};
  margin: 0 0 24px 0;
  border-bottom: 3px solid ${theme.colors.blue[500]};
  padding-bottom: 8px;
`;

const BioText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${theme.colors.secondary};
  margin: 0;
`;

const GenresSection = styled.section`
  margin-bottom: 48px;
`;

const GenresList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const GenreTag = styled.span`
  background: rgba(245, 192, 66, 0.16);
  color: ${theme.colors.accent};
  border: 1px solid rgba(245, 192, 66, 0.35);
  padding: 8px 16px;
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;

  &:hover {
    background: ${theme.colors.accent};
    color: ${theme.colors.ink};
    border-color: ${theme.colors.accent};
  }
`;



const BooksSection = styled.section`
  margin-bottom: 48px;
`;

const NoBooks = styled.div`
  text-align: center;
  padding: 48px;
`;

const NoBooksText = styled.p`
  font-size: 1.2rem;
  color: ${theme.colors.secondary};
  margin: 0;
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const BookCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
  }
`;

const BookTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${theme.colors.blue[500]};
  margin: 0 0 8px 0;
`;

const BookAuthor = styled.div`
  font-size: 1rem;
  color: ${theme.colors.secondary};
  margin: 0 0 8px 0;
`;

const BookDescription = styled.div`
  font-size: 0.9rem;
  color: ${theme.colors.secondary};
  line-height: 1.5;
  margin: 0;
`;
