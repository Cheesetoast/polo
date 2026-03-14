import type { HeadFC, PageProps } from "gatsby"
import { useStaticQuery, graphql } from "gatsby"
import { useEffect, useState } from "react"
import Layout from "../../components/Layout"
import SEO from "../../components/SEO"
import { Text } from "../../components/Text"
import { ContentWrapper } from "../../components/ContentWrapper"
import { Button } from "../../components/Button"
import { BookProgressBar } from "../../components/BookProgressBar"
import { StatusIndicator } from "../../components/StatusIndicator"
import { ImageBlock } from "../../components/ImageBlock"
import { AuthorLink } from "../../components/AuthorLink"
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
  params?: {
    slug: string;
  };
}

const BookPage = ({ params }: BookPageProps) => {
  const slug = params?.slug ?? '';
  
  // Find the book by slug (clean ISBN without dashes)
  const books: Book[] = booksData;
  const book = books.find(b => b.isbn.replace(/-/g, '') === slug);
  const { booksWithStatus, updateBookStatus, updateBookProgress, updateBookRating, clearBookStatus } = useBookStatus(books);
  const bookWithStatus = booksWithStatus.find(b => b.isbn === book?.isbn);

  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [coverError, setCoverError] = useState(false);
  
  // Open Library Covers API (no key required): https://openlibrary.org/dev/docs/api/covers
  const openLibraryCoverUrl = book
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn.replace(/-/g, '')}-L.jpg`
    : '';
  
  // Reset cover error when navigating to a different book so fallback is tried again
  useEffect(() => {
    setCoverError(false);
  }, [slug, book?.isbn]);
  
  // Star Rating Component
  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
    const [hoverRating, setHoverRating] = useState(0);
    
    const handleStarClick = (starIndex: number) => {
      const starValue = starIndex + 1;
      
      // If clicking the same star that's already active, toggle to half-star
      if (rating === starValue) {
        onRatingChange(starValue - 0.5);
      } else {
        onRatingChange(starValue);
      }
    };
    
    const handleStarHover = (starIndex: number) => {
      setHoverRating(starIndex + 1);
    };
    
    const handleMouseLeave = () => {
      setHoverRating(0);
    };
    
    const renderStar = (starIndex: number) => {
      const starValue = starIndex + 1;
      const isActive = hoverRating > 0 ? hoverRating >= starValue : rating >= starValue;
      const isHalfStar = rating === starValue - 0.5;
      
      return (
        <Star
          key={starIndex}
          className={`${isActive ? 'active' : ''} ${isHalfStar ? 'half-star' : ''}`}
          onClick={() => handleStarClick(starIndex)}
          onMouseEnter={() => handleStarHover(starIndex)}
          onMouseLeave={handleMouseLeave}
        >
          ★
        </Star>
      );
    };
    
    return (
      <StarContainer>
        {[0, 1, 2, 3, 4].map(renderStar)}
      </StarContainer>
    );
  };
  
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
                  By <AuthorLink authorName={book.author}>{book.author}</AuthorLink>
                </Text>
              </div>
            </BookHeader>

            <StatusIndicatorRow>
              <StatusIndicator 
                status={bookWithStatus?.status || null} 
                size="large" 
              />
            </StatusIndicatorRow>

            <StatusContainer>
              <StatusLabelGroup>
                <FieldLabel variant="caption" color="secondary">
                  Update Status:
                </FieldLabel>

                <StatusSelector
                  value={bookWithStatus?.status || ""}
                  onChange={(e) => {
                    const newStatus = e.target.value as ReadingStatus | "";

                    if (newStatus === "") {
                      // Clear the status by setting it to null
                      updateBookStatus(book.isbn, null);
                      return;
                    }

                    if (newStatus === "finished") {
                      // Show custom confirmation modal instead of using window.confirm
                      setShowFinishConfirm(true);
                      return;
                    }

                    // Update to the selected status for other options
                    updateBookStatus(book.isbn, newStatus as ReadingStatus);
                  }}
                >
                  <option value="">No Status</option>
                  <option value="want-to-read">Want to Read</option>
                  <option value="currently-reading">Currently Reading</option>
                  <option value="finished">Finished</option>
                </StatusSelector>
              </StatusLabelGroup>
              
              {/* Progress Input */}
              {(bookWithStatus?.status === 'currently-reading' || 
                bookWithStatus?.status === 'finished') && (
                <ProgressControl>
                  <ProgressLabelRow>
                    <Text variant="caption" weight="medium">
                      Reading progress: {(bookWithStatus?.progress ?? 0)}%
                    </Text>
                  </ProgressLabelRow>
                  <ProgressInput
                    value={bookWithStatus?.progress ?? 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const progress = parseInt(e.target.value) || 0;
                      updateBookProgress(book.isbn, progress);
                    }}
                  />
                </ProgressControl>
              )}

              {/* User Rating Input */}
              <RatingSection>
                <StarRating
                  rating={bookWithStatus?.userRating || 0}
                  onRatingChange={(rating) => updateBookRating(book.isbn, rating)}
                />
              </RatingSection>
            </StatusContainer>

            <BookContent>
              <BookMain>
                {(() => {
                  if (book.image?.gatsbyImageData) {
                    return (
                      <BookImage>
                        <ImageBlock
                          image={book.image.gatsbyImageData}
                          alt={book.image.title || book.title}
                        />
                      </BookImage>
                    );
                  }
                  if (openLibraryCoverUrl && !coverError) {
                    return (
                      <BookImage>
                        <FallbackCover
                          src={openLibraryCoverUrl}
                          alt={`Cover: ${book.title}`}
                          onError={() => setCoverError(true)}
                          onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            const img = e.currentTarget;
                            if (img.naturalWidth <= 1 || img.naturalHeight <= 1) {
                              setCoverError(true);
                            }
                          }}
                          crossOrigin=""
                          referrerPolicy="no-referrer"
                        />
                      </BookImage>
                    );
                  }
                  return (
                    <BookImage>
                      <CoverPlaceholder>No cover</CoverPlaceholder>
                    </BookImage>
                  );
                })()}

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


                  </BookMetadata>
                </BookDetails>
              </BookMain>
            </BookContent>
          </BookContainer>

          {showFinishConfirm && (
            <ConfirmModalOverlay>
              <ConfirmModalContent>
                <Text variant="h4">Mark as finished?</Text>
                <Text variant="p" color="secondary">
                  Do you also want to set your reading progress for this book to 100%?
                </Text>
                <ConfirmModalActions>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      // Just update the status to finished, keep existing progress
                      updateBookStatus(book.isbn, "finished");
                      setShowFinishConfirm(false);
                    }}
                  >
                    No, keep current progress
                  </Button>
                  <Button
                    onClick={() => {
                      updateBookProgress(book.isbn, 100);
                      updateBookStatus(book.isbn, "finished");
                      setShowFinishConfirm(false);
                    }}
                  >
                    Yes, mark as 100%
                  </Button>
                </ConfirmModalActions>
              </ConfirmModalContent>
            </ConfirmModalOverlay>
          )}
        </ContentWrapper>
      </main>
    </Layout>
  );
};

export default BookPage;

export const Head: HeadFC<BookPageProps> = ({ params }) => {
  const books: Book[] = booksData;
  const slug = params?.slug ?? '';
  const book = books.find(b => b.isbn.replace(/-/g, '') === slug);
  
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

const ProgressControl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  margin-top: 4px;
`;

const ProgressLabelRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const ProgressInput = styled.input.attrs({
  type: 'range',
  min: 0,
  max: 100,
  step: 1,
})`
  width: 160px;
  cursor: pointer;
  accent-color: ${theme.colors.primary};
`;

const ConfirmModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ConfirmModalContent = styled.div`
  background: #ffffff;
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  max-width: 420px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ConfirmModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
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
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.xl};
  gap: ${theme.spacing.md};
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

const FallbackCover = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const CoverPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.muted};
  color: ${theme.colors.secondary};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
  padding: ${theme.spacing.sm};
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

const StatusIndicatorRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: ${theme.spacing.xs};
`;

const StatusContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const StatusLabelGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FieldLabel = styled(Text)`
  font-weight: 500;
`;

const RatingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  margin-top: 8px;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
`;

const Star = styled.span`
  font-size: 24px;
  cursor: pointer;
  color: ${theme.colors.muted};
  transition: color 0.2s ease;
  margin-right: 2px;
  
  &.active {
    color: ${theme.colors.warning || '#f59e0b'};
  }
  
  &.half-star {
    background: linear-gradient(90deg, ${theme.colors.warning || '#f59e0b'} 50%, ${theme.colors.muted} 50%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  &:hover {
    color: ${theme.colors.warning || '#f59e0b'};
  }
`;
