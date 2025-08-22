import React from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import { getAuthorById, getBooksByAuthor } from '../../utils/authorUtils';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import { Book } from '../../components/Book';

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
          <BackButton onClick={() => navigate('/authors')}>
            Back to Authors
          </BackButton>
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
        <BackButton onClick={handleBackToAuthors}>
          ← Back to Authors
        </BackButton>

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

const BackButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;

  &:hover {
    color: #6c757d;
  }
`;

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 48px;
  max-width: 600px;
  margin: 0 auto;
`;

const NotFoundTitle = styled.h1`
  font-size: 2.5rem;
  color: #6c757d;
  margin: 0 0 16px 0;
`;

const NotFoundText = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
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
  background: #007bff;
  color: white;
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
  color: #007bff;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const AuthorFullName = styled.p`
  font-size: 1.3rem;
  color: #6c757d;
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
  color: #6c757d;
  min-width: 100px;
`;

const MetaValue = styled.span`
  color: #6c757d;
`;

const AuthorWebsite = styled.div`
  margin-top: 16px;
`;

const WebsiteLink = styled.a`
  display: inline-block;
  background: #007bff;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #6c757d;
  }
`;

const BioSection = styled.section`
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #007bff;
  margin: 0 0 24px 0;
  border-bottom: 3px solid #007bff;
  padding-bottom: 8px;
`;

const BioText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #6c757d;
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
  background: #007bff;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
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
  color: #6c757d;
  margin: 0;
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const BookCard = styled.div`
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const BookTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #007bff;
  margin: 0 0 8px 0;
`;

const BookAuthor = styled.div`
  font-size: 1rem;
  color: #6c757d;
  margin: 0 0 8px 0;
`;

const BookDescription = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
  line-height: 1.5;
  margin: 0;
`;
