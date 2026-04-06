import type { HeadFC, PageProps } from "gatsby"
import { useStaticQuery, graphql } from "gatsby"
import { useEffect, useRef, useState } from "react"
import Layout from "../../components/Layout"
import SEO from "../../components/SEO"
import { Text } from "../../components/Text"
import { ContentWrapper } from "../../components/ContentWrapper"
import { Button } from "../../components/Button"
import { BookProgressBar } from "../../components/BookProgressBar"
import { ImageBlock } from "../../components/ImageBlock"
import { AuthorLink } from "../../components/AuthorLink"
import { useBookStatus } from "../../hooks/useBookStatus"
import { ReadingStatus } from "../../types/reading"
import booksData from "../../data/books.json"
import { navigate } from "gatsby"
import styled, { css } from "styled-components"
import { rgba, theme } from "../../styles/theme"
import { bookPageShell } from "../../styles/surfaceStyles"

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

type BookPageStatusChoice = ReadingStatus | "none"

const BOOK_PAGE_STATUS_CHOICES: { value: BookPageStatusChoice; label: string }[] =
  [
    { value: "none", label: "No Status" },
    { value: "want-to-read", label: "Want to Read" },
    { value: "currently-reading", label: "Currently Reading" },
    { value: "finished", label: "Finished" },
  ]

const BookPage = ({ params }: BookPageProps) => {
  const { slug } = params;
  
  // Find the book by slug (clean ISBN without dashes)
  const books: Book[] = booksData;
  const book = books.find(b => b.isbn.replace(/-/g, '') === slug);
  const { booksWithStatus, updateBookStatus, updateBookProgress, updateBookRating, clearBookStatus } = useBookStatus(books);
  const bookWithStatus = booksWithStatus.find(b => b.isbn === book?.isbn);

  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [ratingJustSaved, setRatingJustSaved] = useState(false);
  const ratingHighlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (ratingHighlightTimeoutRef.current !== null) {
        clearTimeout(ratingHighlightTimeoutRef.current);
      }
    };
  }, []);
  
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
      <StarContainer aria-labelledby="book-page-your-rating-label">
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

  const handleStatusChoice = (choice: BookPageStatusChoice) => {
    if (choice === "none") {
      updateBookStatus(book.isbn, null);
      return;
    }
    if (choice === "finished") {
      if (bookWithStatus?.status === "finished") return;
      setShowFinishConfirm(true);
      return;
    }
    updateBookStatus(book.isbn, choice);
  };

  return (
    <Layout>
      <BookPageMain>
        <ContentWrapper>
          <BookBackButton
            type="button"
            variant="ghost"
            onClick={() => navigate('/search')}
          >
            ← Back to Search
          </BookBackButton>

          <BookContainer>
            <BookHeader>
              <BookHeaderText>
                <Text variant="h1" align="center">
                  {book.title}
                </Text>
                <Text variant="h3" color="secondary" align="center">
                  By <AuthorLink authorName={book.author}>{book.author}</AuthorLink>
                </Text>
              </BookHeaderText>
            </BookHeader>

            <StatusContainer>
              <StatusLabelGroup>
                <FieldLabel
                  id="book-page-status-label"
                  variant="caption"
                  color="secondary"
                >
                  Update Status:
                </FieldLabel>

                <StatusToggleGroup
                  role="radiogroup"
                  aria-labelledby="book-page-status-label"
                >
                  {BOOK_PAGE_STATUS_CHOICES.map(({ value, label }) => {
                    const current = bookWithStatus?.status ?? null;
                    const selected =
                      value === "none"
                        ? current === null
                        : current === value;
                    return (
                      <StatusToggle
                        key={value}
                        id={`book-page-status-${value}`}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        $selected={selected}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => handleStatusChoice(value)}
                        onKeyDown={(e) => {
                          const i = BOOK_PAGE_STATUS_CHOICES.findIndex(
                            (c) => c.value === value
                          );
                          const go = (next: number) => {
                            const nextValue = BOOK_PAGE_STATUS_CHOICES[next].value;
                            handleStatusChoice(nextValue);
                            requestAnimationFrame(() => {
                              document
                                .getElementById(`book-page-status-${nextValue}`)
                                ?.focus();
                            });
                          };
                          if (
                            e.key === "ArrowRight" ||
                            e.key === "ArrowDown"
                          ) {
                            e.preventDefault();
                            go(Math.min(i + 1, BOOK_PAGE_STATUS_CHOICES.length - 1));
                            return;
                          }
                          if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                            e.preventDefault();
                            go(Math.max(i - 1, 0));
                          }
                        }}
                      >
                        <StatusToggleCheck aria-hidden $visible={selected}>
                          ✓
                        </StatusToggleCheck>
                        <StatusToggleLabelText>{label}</StatusToggleLabelText>
                      </StatusToggle>
                    );
                  })}
                </StatusToggleGroup>
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
            </StatusContainer>

            <BookContent>
              <BookMain>
                <BookDescriptionColumn>
                  {book.description?.description ? (
                    <BookDescription>
                      <Text variant="h4">Description</Text>
                      <Text variant="p">{book.description.description}</Text>
                    </BookDescription>
                  ) : (
                    <Text variant="p" color="secondary">
                      No description available.
                    </Text>
                  )}
                </BookDescriptionColumn>

                <BookSidebarColumn>
                  {book.image?.gatsbyImageData && (
                    <BookImage>
                      <ImageBlock
                        image={book.image.gatsbyImageData}
                        alt={book.image.title || book.title}
                      />
                    </BookImage>
                  )}

                  <SidebarRatingSection>
                    <SidebarRatingLabel
                      id="book-page-your-rating-label"
                      variant="caption"
                      color="secondary"
                    >
                      Your rating
                    </SidebarRatingLabel>
                    <RatingStarsWrap $highlight={ratingJustSaved}>
                      <StarRating
                        rating={bookWithStatus?.userRating || 0}
                        onRatingChange={(rating) => {
                          updateBookRating(book.isbn, rating);
                          if (ratingHighlightTimeoutRef.current !== null) {
                            clearTimeout(ratingHighlightTimeoutRef.current);
                          }
                          setRatingJustSaved(true);
                          ratingHighlightTimeoutRef.current = setTimeout(() => {
                            setRatingJustSaved(false);
                            ratingHighlightTimeoutRef.current = null;
                          }, 900);
                        }}
                      />
                    </RatingStarsWrap>
                  </SidebarRatingSection>

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
                </BookSidebarColumn>
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
      </BookPageMain>
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
const BookPageMain = styled.main`
  min-width: 0;
  width: 100%;
`;

const BookBackButton = styled(Button)`
  margin-bottom: ${theme.spacing.md};
  max-width: 100%;

  @media (min-width: 768px) {
    margin-bottom: ${theme.spacing.lg};
  }
`;

const StatusToggleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  width: 100%;
  min-width: 0;
  margin-top: ${theme.spacing.xs};

  @media (min-width: 640px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${theme.spacing.md};
  }
`

const StatusToggleCheck = styled.span<{ $visible: boolean }>`
  position: absolute;
  left: ${theme.spacing.md};
  top: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.bold};
  line-height: 1;
  pointer-events: none;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: ${(p) =>
    p.$visible ? "translateY(-50%) scale(1)" : "translateY(-50%) scale(0.85)"};
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
`

const StatusToggleLabelText = styled.span`
  display: block;
  width: 100%;
  min-width: 0;
  text-align: center;
`

const StatusToggle = styled.button<{ $selected: boolean }>`
  appearance: none;
  position: relative;
  width: 100%;
  flex: none;
  margin: 0;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-family: ${theme.fontFamily};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  line-height: ${theme.lineHeights.sm};
  letter-spacing: -0.01em;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  white-space: normal;
  overflow-wrap: anywhere;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  @media (min-width: 640px) {
    width: auto;
    flex: 1 1 10rem;
    min-width: min(10rem, 100%);
    white-space: nowrap;
    overflow-wrap: normal;
  }

  ${(p) =>
    p.$selected
      ? css`
          background-color: ${rgba.indigo(0.12)};
          color: ${theme.colors.blue[700]};
          font-weight: ${theme.fontWeights.semibold};
          border-color: ${rgba.indigo(0.35)};
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.55),
            0 0 0 1px ${rgba.indigo(0.12)};
          z-index: 1;
        `
      : css`
          color: ${theme.colors.secondary};

          &:hover {
            background-color: ${rgba.indigo(0.05)};
            color: ${theme.colors.primary};
            border-color: ${rgba.indigo(0.2)};
          }
        `}

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px ${rgba.indigo(0.5)};
    z-index: 2;
  }
`

const ProgressControl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  min-width: 0;
  width: 100%;
  max-width: 28rem;
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
  width: 100%;
  max-width: 20rem;
  min-width: 0;
  cursor: pointer;
  accent-color: ${theme.colors.primary};
`;

const ConfirmModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  padding: ${theme.spacing.md};
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  box-sizing: border-box;
  overflow-y: auto;
`;

const ConfirmModalContent = styled.div`
  background: #ffffff;
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  max-width: 420px;
  width: 100%;
  min-width: 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  box-sizing: border-box;
`;

const ConfirmModalActions = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};

  & > * {
    width: 100%;
  }

  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: flex-end;

    & > * {
      width: auto;
    }
  }
`;
const BookContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  ${bookPageShell}

  @media (min-width: 768px) {
    padding: ${theme.spacing.xl};
  }

  @media (min-width: 1024px) {
    padding: ${theme.spacing["2xl"]};
  }
`;

const BookHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  gap: ${theme.spacing.md};

  @media (min-width: 768px) {
    margin-bottom: ${theme.spacing.xl};
  }
`

const BookHeaderText = styled.div`
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
  text-align: center;
`

const BookContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const BookMain = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.lg};
  align-items: start;

  @media (min-width: 768px) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    gap: ${theme.spacing["2xl"]};
  }
`

const BookDescriptionColumn = styled.div`
  min-width: 0;
  overflow-wrap: anywhere;
`

const BookSidebarColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  min-width: 0;

  @media (max-width: 767px) {
    align-items: center;
  }
`

const BookImage = styled.div`
  width: 100%;
  max-width: min(220px, 72vw);
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    max-width: 200px;
  }
`

const BookDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const BookMetadata = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  min-width: 0;
  width: 100%;

  @media (max-width: 767px) {
    align-self: stretch;
    text-align: left;
  }
`;

const MetadataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  overflow-wrap: anywhere;
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  min-width: 0;
`;

const StatusLabelGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1 1 auto;
  min-width: 0;

  @media (min-width: 640px) {
    flex: 1 1 4rem;
  }
`;

const FieldLabel = styled(Text)`
  font-weight: 500;
`;

const SidebarRatingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
  width: 100%;
  min-width: 0;

  @media (max-width: 767px) {
    align-items: center;
  }
`

const SidebarRatingLabel = styled(FieldLabel)`
  margin-bottom: 0;
`

const RatingStarsWrap = styled.div<{ $highlight: boolean }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  margin: 0;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  background-color: rgba(255, 255, 255, 0.72);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition:
    border-color 0.35s ease,
    box-shadow 0.35s ease,
    background-color 0.35s ease;

  ${(p) =>
    p.$highlight &&
    css`
      background-color: ${rgba.indigo(0.08)};
      border-color: ${rgba.indigo(0.42)};
      box-shadow:
        0 0 0 1px ${rgba.indigo(0.2)},
        0 4px 14px ${rgba.indigo(0.12)};
    `}
`

const StarContainer = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
`;

/** Empty / unselected stars — much lighter than `theme.colors.muted` so fills read clearly. */
const STAR_EMPTY = "#e8e8ed";

const Star = styled.span`
  font-size: clamp(1.25rem, 4.5vw, 1.5rem);
  cursor: pointer;
  color: ${STAR_EMPTY};
  transition: color 0.2s ease;
  margin-right: 2px;
  touch-action: manipulation;
  
  &.active {
    color: ${theme.colors.warning || '#f59e0b'};
  }
  
  &.half-star {
    background: linear-gradient(
      90deg,
      ${theme.colors.warning || "#f59e0b"} 50%,
      ${STAR_EMPTY} 50%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  &:hover {
    color: ${theme.colors.warning || '#f59e0b'};
  }
`;
