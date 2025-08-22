import type { HeadFC, PageProps } from "gatsby"
import { useStaticQuery, graphql } from "gatsby"
import Layout from "../../components/Layout"
import SEO from "../../components/SEO"
import { Text } from "../../components/Text"
import { ContentWrapper } from "../../components/ContentWrapper"
import { Button } from "../../components/Button"
import { BookProgressBar } from "../../components/BookProgressBar"
import { StatusIndicator } from "../../components/StatusIndicator"
import { ImageBlock } from "../../components/ImageBlock"
import { useBookStatus } from "../../hooks/useBookStatus"
import { ReadingStatus } from "../../components/BookBoard"
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
  genre?: string;
  progress?: number;
  dateStarted?: string | null;
  dateFinished?: string | null;
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
  const { booksWithStatus, updateBookStatus, updateBookProgress } = useBookStatus(books);
  const bookWithStatus = booksWithStatus.find(b => b.isbn.replace(/-/g, '') === slug);

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

  const getRatingDisplay = (book: Book) => {
    if (book.userRating !== undefined && book.userRating !== null) {
      return `${book.userRating.toFixed(1)} (your rating)`;
    }
    if (book.communityRating !== undefined && book.communityRating !== null) {
      return `${book.communityRating.toFixed(1)} (community)`;
    }
    return 'No rating';
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getBookStatus = (book: any) => {
    if (book.dateFinished) return 'finished';
    if (book.progress && book.progress > 0) return 'currently-reading';
    return 'want-to-read';
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
                  status={getBookStatus(bookWithStatus || book)} 
                  size="large" 
                />
                <StatusCaption variant="caption" color="secondary">
                  Update Status:
                </StatusCaption>
                <StatusSelector
                  value={getBookStatus(bookWithStatus || book) || ""}
                  onChange={(e) => {
                    const newStatus = e.target.value === "" ? null : e.target.value as ReadingStatus;
                    if (bookWithStatus) {
                      updateBookStatus(book.isbn, newStatus);
                    }
                  }}
                >
                  <option value="">No Status</option>
                  <option value="not-started">Want to Read</option>
                  <option value="in-progress">Currently Reading</option>
                  <option value="finished">Finished</option>
                </StatusSelector>
                
                {/* Progress Input */}
                {(getBookStatus(bookWithStatus || book) === 'in-progress' || 
                  getBookStatus(bookWithStatus || book) === 'finished') && (
                  <ProgressInput
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Progress %"
                    value={bookWithStatus?.progress || book.progress || 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const progress = parseInt(e.target.value) || 0;
                      if (bookWithStatus) {
                        updateBookProgress(book.isbn, progress);
                      }
                    }}
                  />
                )}
                
                {/* Date Finished Input */}
                {getBookStatus(bookWithStatus || book) === 'finished' && (
                  <DateInput
                    type="date"
                    value={bookWithStatus?.dateFinished || book.dateFinished || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const dateFinished = e.target.value || null;
                      // Note: This would require extending the useBookStatus hook to handle dates
                      // For now, we'll just show the input but not save the date
                    }}
                  />
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
                      <Text variant="caption" weight="medium">Genre:</Text>
                      <Text variant="p">{book.genre || 'Not specified'}</Text>
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
                      <Text variant="p">{getRatingDisplay(book)}</Text>
                    </MetadataItem>

                    {book.progress !== undefined && (
                      <MetadataItem>
                        <Text variant="caption" weight="medium">Progress:</Text>
                        <BookProgressBar progress={book.progress} />
                      </MetadataItem>
                    )}

                    <MetadataItem>
                      <Text variant="caption" weight="medium">Started:</Text>
                      <Text variant="p">{formatDate(book.dateStarted)}</Text>
                    </MetadataItem>

                    <MetadataItem>
                      <Text variant="caption" weight="medium">Finished:</Text>
                      <Text variant="p">{formatDate(book.dateFinished)}</Text>
                    </MetadataItem>
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
      keywords={['book', 'reading', book?.genre || '', book?.author || '']}
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
