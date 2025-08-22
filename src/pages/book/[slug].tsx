import type { HeadFC, PageProps } from "gatsby"
import { useStaticQuery, graphql } from "gatsby"
import { useEffect } from "react"
import Layout from "../../components/Layout"
import SEO from "../../components/SEO"
import { Text } from "../../components/Text"
import { ContentWrapper } from "../../components/ContentWrapper"
import { Button } from "../../components/Button"
import { BookProgressBar } from "../../components/BookProgressBar"
import { StatusIndicator } from "../../components/StatusIndicator"
import { ImageBlock } from "../../components/ImageBlock"
import { useBookStatus } from "../../hooks/useBookStatus"
import { ReadingStatus } from "../../types/reading"
import booksData from "../../data/books.json"
import { navigate } from "gatsby"
import styled from "styled-components"
import { theme } from "../../styles/theme"

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
  communityRating?: number | null;
  userRating?: number | null;
  genres?: string[];
  progress?: number;
  pages?: number;
}

interface BookPageProps extends PageProps {
  params: {
    slug: string;
  };
}

const BookPage = ({ params }: BookPageProps) => {
  const { slug } = params;
  
  // Find the book by slug (clean ISBN without dashes)
  const books: Book[] = booksData;
  const book = books.find(b => b.isbn.replace(/-/g, '') === slug);
  const { booksWithStatus, updateBookStatus, updateBookProgress, updateBookRating, clearBookStatus } = useBookStatus(books);
  const bookWithStatus = booksWithStatus.find(b => b.isbn === book?.isbn);
  
  // Monitor when booksWithStatus changes

  


  if (!book) {
    return (
      <Layout>
        <ContentWrapper>
          <div>
            <Text variant="h1">Book Not Found</Text>
            <Text variant="p" color="secondary">
              The book you're looking for doesn't exist.
            </Text>
            <Button onClick={() => navigate('/search')}>
              Back to Search
            </Button>
          </div>
        </ContentWrapper>
      </Layout>
    );
  }

  const getRatingDisplay = (book: Book, bookWithStatus?: any) => {
    if (bookWithStatus?.userRating !== undefined && bookWithStatus?.userRating !== null) {
      return `${bookWithStatus.userRating.toFixed(1)} (your rating)`;
    }
    if (book.communityRating !== undefined && book.communityRating !== null) {
      return `${book.communityRating.toFixed(1)} (community)`;
    }
    return 'No rating';
  };



  const getBookStatus = (book: any): ReadingStatus | null => {
    const status = book.progress && book.progress === 100 ? 'finished' : 
                   book.progress && book.progress > 0 ? 'currently-reading' : 
                   'want-to-read';
    return status;
  };

  return (
    <Layout>
      <main>
        <ContentWrapper>
          <BackButton onClick={() => navigate('/search')}>
            ← Back to Search
          </BackButton>

          <BookContainer>
            <BookHeader>
              <div>
                <Text variant="h1">{book.title}</Text>
                <Text variant="h3" color="secondary">
                  By {book.author}
                </Text>
              </div>
              <StatusContainer>
                <StatusIndicator 
                  status={bookWithStatus?.status || null} 
                  size="large" 
                />
                <StatusCaption variant="caption" color="secondary">
                  Update Status:
                </StatusCaption>

                <StatusSelector
                  value={bookWithStatus?.status || ""}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    
                    if (newStatus === "") {
                      // Clear the status by setting it to null
                      updateBookStatus(book.isbn, null);
                    } else {
                      // Update to the selected status
                      updateBookStatus(book.isbn, newStatus as ReadingStatus);
                    }
                  }}
                >
                  <option value="">No Status</option>
                  <option value="want-to-read">Want to Read</option>
                  <option value="currently-reading">Currently Reading</option>
                  <option value="finished">Finished</option>
                </StatusSelector>
                
                {/* Progress Input */}
                {(bookWithStatus?.status === 'currently-reading' || 
                  bookWithStatus?.status === 'finished') && (
                  <ProgressInput
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Progress %"
                    value={book.progress || 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const progress = parseInt(e.target.value) || 0;
                      updateBookProgress(book.isbn, progress);
                    }}
                  />
                )}

                {/* User Rating Input */}
                {bookWithStatus?.status === 'finished' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                    <Text variant="caption" weight="medium">Your Rating:</Text>
                    <RatingInput
                      type="number"
                      min="1"
                      max="5"
                      step="0.5"
                      placeholder="Rate 1-5"
                      value={bookWithStatus?.userRating || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const rating = e.target.value ? parseFloat(e.target.value) : null;
                        updateBookRating(book.isbn, rating);
                      }}
                    />
                  </div>
                )}
                

              </StatusContainer>
            </BookHeader>

            <BookContent>
              <BookMain>
                {book.image?.gatsbyImageData && (
                  <BookImage>
                    <ImageBlock
                      image={book.image.gatsbyImageData}
                      alt={book.image.title || book.title}
                    />
                  </BookImage>
                )}

                <BookDetails>
                  {book.description?.description && (
                    <BookDescription>
                      <Text variant="h4">Description</Text>
                      <Text variant="p">{book.description.description}</Text>
                    </BookDescription>
                  )}

                  <BookMetadata>
                    <MetadataItem>
                      <Text variant="caption" weight="medium">Genres:</Text>
                      <Text variant="p">{book.genres && book.genres.length > 0 ? book.genres.join(', ') : 'Not specified'}</Text>
                    </MetadataItem>

                    <MetadataItem>
                      <Text variant="caption" weight="medium">ISBN:</Text>
                      <Text variant="p">{book.isbn}</Text>
                    </MetadataItem>

                    {book.pages && (
                      <MetadataItem>
                        <Text variant="caption" weight="medium">Pages:</Text>
                        <Text variant="p">{book.pages}</Text>
                      </MetadataItem>
                    )}

                    <MetadataItem>
                      <Text variant="caption" weight="medium">Rating:</Text>
                      <Text variant="p">{getRatingDisplay(book, bookWithStatus)}</Text>
                    </MetadataItem>

                    {book.progress !== undefined && (
                      <MetadataItem>
                        <Text variant="caption" weight="medium">Progress:</Text>
                        <BookProgressBar progress={book.progress} />
                      </MetadataItem>
                    )}


                  </BookMetadata>
                </BookDetails>
              </BookMain>
            </BookContent>
          </BookContainer>
        </ContentWrapper>
      </main>
    </Layout>
  );
};

export default BookPage;

export const Head: HeadFC<BookPageProps> = ({ params }) => {
  const books: Book[] = booksData;
  const book = books.find(b => b.isbn.replace(/-/g, '') === params.slug);
  
  return (
    <SEO
      title={book ? `${book.title} by ${book.author}` : 'Book Not Found'}
      description={book?.description?.description || 'Book details'}
      keywords={['book', 'reading', book?.genres?.join(', ') || '', book?.author || '']}
    />
  );
};

// Styled Components
const StatusSelector = styled.select`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border: 1px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.sm};
  background: white;
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  min-width: 140px;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
  }
`;

const ProgressInput = styled.input`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border: 1px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.sm};
  background: white;
  font-size: ${theme.fontSizes.sm};
  width: 80px;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
  }
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const RatingInput = styled.input`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border: 1px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.sm};
  background: white;
  font-size: ${theme.fontSizes.sm};
  width: 80px;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
  }
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const DateInput = styled.input`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border: 1px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.sm};
  background: white;
  font-size: ${theme.fontSizes.sm};
  width: 120px;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.base};
  cursor: pointer;
  padding: ${theme.spacing.sm} 0;
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  
  &:hover {
    text-decoration: underline;
  }
`;

const BookContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const BookHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.xl};
  gap: ${theme.spacing.lg};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BookContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const BookMain = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: ${theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
`;

const BookImage = styled.div`
  width: 200px;
  height: 300px;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const BookDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const BookDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const BookMetadata = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const MetadataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StatusCaption = styled(Text)`
  margin-top: 4px;
`;
