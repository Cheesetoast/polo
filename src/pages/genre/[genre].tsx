import React from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import { getBooksByGenre, getBooksByAuthorGenre } from '../../utils/authorUtils';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';

interface GenrePageProps {
  params: {
    genre: string;
  };
}

const GenrePage = ({ params }: GenrePageProps) => {
  const genre = decodeURIComponent(params.genre);
  
  // Try to get books by exact genre match first
  let books = getBooksByGenre(genre);
  let genreType = 'book';
  
  // If no books found, try author genre matching
  if (books.length === 0) {
    books = getBooksByAuthorGenre(genre);
    genreType = 'author';
  }

  if (books.length === 0) {
    return (
      <Layout>
        <SEO title={`${genre} - Genre`} description={`No books found in ${genre} genre`} />
        <NotFoundContainer>
          <NotFoundTitle>No Books Found</NotFoundTitle>
          <NotFoundText>No books found in the {genre} genre.</NotFoundText>
          <BackButton onClick={() => navigate('/bookshelf')}>
            Back to Bookshelf
          </BackButton>
        </NotFoundContainer>
      </Layout>
    );
  }

  const handleBookClick = (book: any) => {
    navigate(`/book/${book.isbn.replace(/-/g, '')}`);
  };

  const handleBackToBookshelf = () => {
    navigate('/bookshelf');
  };

  return (
    <Layout>
      <SEO 
        title={`${genre} Books`} 
        description={`Explore ${books.length} books in the ${genre} genre`} 
      />
      <PageContainer>
        <BackButton onClick={handleBackToBookshelf}>
          ← Back to Bookshelf
        </BackButton>

        <GenreHeader>
          <GenreTitle>{genre}</GenreTitle>
                  <GenreSubtitle>
          {books.length} book{books.length !== 1 ? 's' : ''} found
          {genreType === 'author' && ` (matched from author genre: ${genre})`}
        </GenreSubtitle>
        </GenreHeader>

        <BooksGrid>
          {books.map(book => (
            <BookCard 
              key={book.isbn} 
              onClick={() => handleBookClick(book)}
            >
              <BookTitle>{book.title}</BookTitle>
              <BookAuthor>{book.author}</BookAuthor>
              {book.description && (
                <BookDescription>{book.description.description}</BookDescription>
              )}
              <BookMeta>
                <Rating>Rating: {book.communityRating}/5</Rating>
                {book.pages && <Pages>{book.pages} pages</Pages>}
              </BookMeta>
              {book.genres && book.genres.length > 0 && (
                <BookGenres>
                  {book.genres.map((genre, index) => (
                    <BookGenreTag key={index}>{genre}</BookGenreTag>
                  ))}
                </BookGenres>
              )}
            </BookCard>
          ))}
        </BooksGrid>
      </PageContainer>
    </Layout>
  );
};

export default GenrePage;

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
  font-size: 1.1rem;
  color: #9ca3af;
  margin: 0 0 24px 0;
`;

const GenreHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const GenreTitle = styled.h1`
  font-size: 3rem;
  margin: 0 0 16px 0;
  color: #111827;
`;

const GenreSubtitle = styled.p`
  font-size: 1.2rem;
  color: #6b7280;
  margin: 0;
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const BookCard = styled.div`
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

const BookTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  color: #111827;
`;

const BookAuthor = styled.p`
  margin: 0 0 12px 0;
  font-size: 1rem;
  color: #6b7280;
  font-style: italic;
`;

const BookDescription = styled.p`
  margin: 0 0 16px 0;
  line-height: 1.5;
  color: #6b7280;
  font-size: 0.9rem;
`;

const BookMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #9ca3af;
`;

const Rating = styled.span`
  font-weight: 500;
`;

const Pages = styled.span`
  font-weight: 500;
`;

const BookGenres = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

const BookGenreTag = styled.span`
  background: #f3f4f6;
  color: #374151;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
`;
