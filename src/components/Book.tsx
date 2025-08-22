import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Text } from './Text';
import { ImageBlock } from './ImageBlock';
import { StatusIndicator } from './StatusIndicator';
import { BookProgressBar } from './BookProgressBar';
import { DEFAULTS } from '../constants';
// Temporarily commented out to fix build issues
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
import { navigate } from 'gatsby';

export interface Book {
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
    communityRating?: number | null; // Average rating from the community
    userRating?: number | null; // User's personal rating (only available after finishing)
    genre?: string;
    progress?: number;
    dateStarted?: string | null;
    dateFinished?: string | null;
  
    pages?: number;
}

export interface BookProps {
    book: Book & { status?: string };
    onClick?: () => void;
    style?: Record<string, any>; // Generic CSS properties
    showStatus?: boolean;
    dragHandleProps?: any; // Props for the drag handle
    isDragging?: boolean;
}

export const Book = ({ book, onClick, style, showStatus = false, dragHandleProps, isDragging = false }: BookProps) => {
    const handleTitleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the card's onClick
        navigate(`/book/${book.isbn.replace(/-/g, '')}`);
    };

    const handleAuthorClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the card's onClick
        navigate(`/search-results?author=${encodeURIComponent(book.author)}`);
    };

    return (
        <StyledBook 
            onClick={onClick} 
            style={style}
            $isDragging={isDragging}
        >
            <BookHeader>
                <BookHeaderContent>
                    <BookInfo>
                        <BookTitle 
                            onClick={handleTitleClick}
                        >
                            {book.title}
                        </BookTitle>
                        <AuthorName onClick={handleAuthorClick}>
                            By {book.author}
                        </AuthorName>
                    </BookInfo>
                    <BookActions>
                        {/* Temporarily commented out to fix build issues */}
                        {/* {showStatus && book.status && (
                            <StatusIndicator status={book.status} size="small" showLabel={false} />
                        )} */}
                        {dragHandleProps && (
                            <DragHandle {...dragHandleProps}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M4 6h8v1H4V6zm0 3h8v1H4V9z"/>
                                </svg>
                            </DragHandle>
                        )}
                    </BookActions>
                </BookHeaderContent>
            </BookHeader>

            <BookContent>
                {book.description?.description && (
                    <Text variant="p">
                        {book.description.description}
                    </Text>
                )}
                
                {/* Book Metadata */}
                <MetadataContainer>
                    {book.genre && (
                        <GenreTag>
                            {book.genre}
                        </GenreTag>
                    )}
                    
                    {book.communityRating && (
                        <RatingTag>
                            ⭐ {book.communityRating}
                        </RatingTag>
                    )}
                </MetadataContainer>

                {/* Progress Bar */}
                {book.progress !== undefined && (
                    <BookProgressBar 
                        progress={book.progress} 
                    />
                )}

                {/* Reading Dates */}
                <ReadingDates>
                    {book.dateStarted && (
                        <div>Started: {new Date(book.dateStarted).toLocaleDateString()}</div>
                    )}
                    {book.dateFinished && (
                        <div>Finished: {new Date(book.dateFinished).toLocaleDateString()}</div>
                    )}
                </ReadingDates>
            </BookContent>
        </StyledBook>
    );
};

export default Book;

// Styled Components
const StyledBook = styled.div<{ $isDragging?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  width: 100%;
  max-width: 300px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  transform: ${props => props.$isDragging ? 'scale(1.05)' : 'scale(1)'};
  box-shadow: ${props => props.$isDragging ? '0 4px 8px rgba(0, 0, 0, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.1)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const BookHeader = styled.div`
  margin-bottom: ${theme.spacing.sm};
`;

const BookContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const BookFooter = styled.div`
  margin-top: auto;
  padding-top: ${theme.spacing.sm};
  border-top: 1px solid ${theme.colors.muted};
`;

const BookTitle = styled.div`
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xs};
  
  &:hover {
    color: ${theme.colors.primary};
    text-decoration: underline;
  }
`;

const AuthorName = styled.div`
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.secondary};
  margin-top: ${theme.spacing.xs};
  
  &:hover {
    color: ${theme.colors.secondary};
    text-decoration: underline;
  }
`;

const DragHandle = styled.div`
  cursor: grab;
  color: ${theme.colors.muted};
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;
  background-color: ${theme.colors.muted}10;
  border: 1px solid ${theme.colors.muted}20;
  
  &:hover {
    color: ${theme.colors.primary};
    background-color: ${theme.colors.primary}10;
    border-color: ${theme.colors.primary}30;
    transform: scale(1.05);
  }
  
  &:active {
    cursor: grabbing;
    transform: scale(0.95);
  }
  
  svg {
    display: block;
  }
`;

const BookHeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.xs};
`;

const BookInfo = styled.div`
  flex: 1;
`;

const BookActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const MetadataContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
  margin-top: ${theme.spacing.xs};
`;

const GenreTag = styled.span`
  background-color: ${theme.colors.primary};
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
`;

const RatingTag = styled.span`
  background-color: ${theme.colors.secondary};
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
`;

const ReadingDates = styled.div`
  margin-top: ${theme.spacing.xs};
  font-size: 0.75rem;
  color: ${theme.colors.muted};
`;
