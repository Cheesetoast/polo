import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Text } from './Text';
import { ImageBlock } from './ImageBlock';
import { StatusIndicator } from './StatusIndicator';
import { BookProgressBar } from './BookProgressBar';
import { ReadingStatus } from './BookBoard';
import { DEFAULTS } from '../constants';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
    book: Book & { status?: ReadingStatus };
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing.xs }}>
                    <div style={{ flex: 1 }}>
                        <BookTitle 
                            onClick={handleTitleClick}
                        >
                            {book.title}
                        </BookTitle>
                        <AuthorName onClick={handleAuthorClick}>
                            By {book.author}
                        </AuthorName>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                        {showStatus && book.status && (
                            <StatusIndicator status={book.status} size="small" showLabel={false} />
                        )}
                        {dragHandleProps && (
                            <DragHandle {...dragHandleProps}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M4 6h8v1H4V6zm0 3h8v1H4V9z"/>
                                </svg>
                            </DragHandle>
                        )}
                    </div>
                </div>
            </BookHeader>

            <BookContent>
                {book.description?.description && (
                    <Text variant="p">
                        {book.description.description}
                    </Text>
                )}
                
                {/* Book Metadata */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.xs, marginTop: theme.spacing.xs }}>
                    {book.genre && (
                        <span style={{ 
                            backgroundColor: theme.colors.primary, 
                            color: 'white', 
                            padding: '2px 8px', 
                            borderRadius: theme.borderRadius.sm,
                            fontSize: '12px'
                        }}>
                            {book.genre}
                        </span>
                    )}

                </div>

                {/* Progress Bar */}
                {book.progress !== undefined && (
                    <BookProgressBar progress={book.progress} />
                )}
                
                {book.image?.gatsbyImageData && (
                    <ImageBlock
                        image={book.image.gatsbyImageData}
                        alt={book.image.title || DEFAULTS.FALLBACK_BOOK_COVER}
                    />
                )}
            </BookContent>

            <BookFooter>
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
                    {book.isbn && (
                        <Text variant="caption">ISBN: {book.isbn}</Text>
                    )}
                    
                    {/* Ratings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {/* Community Rating */}
                        {book.communityRating && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Text variant="caption">Community:</Text>
                                <div style={{ display: 'flex' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} style={{ 
                                            color: i < book.communityRating! ? '#FFD700' : theme.colors.muted,
                                            fontSize: '12px'
                                        }}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <Text variant="caption" style={{ marginLeft: '4px' }}>
                                    ({book.communityRating?.toFixed(1) || '0.0'})
                                </Text>
                            </div>
                        )}
                        
                        {/* User Rating - only show if book is finished */}
                        {book.dateFinished && book.userRating && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Text variant="caption">Your Rating:</Text>
                                <div style={{ display: 'flex' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} style={{ 
                                            color: i < book.userRating! ? '#FF6B6B' : theme.colors.muted,
                                            fontSize: '12px'
                                        }}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <Text variant="caption" style={{ marginLeft: '4px' }}>
                                    ({book.userRating?.toFixed(1) || '0.0'})
                                </Text>
                            </div>
                        )}
                    </div>
                    
                    {/* Dates */}
                    {book.dateStarted && (
                        <Text variant="caption">
                            Started: {new Date(book.dateStarted).toLocaleDateString()}
                        </Text>
                    )}
                    {book.dateFinished && (
                        <Text variant="caption">
                            Finished: {new Date(book.dateFinished).toLocaleDateString()}
                        </Text>
                    )}
                </div>
            </BookFooter>
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
