/**
 * Presentational book card without @dnd-kit — for use in lists and SSR-safe pages.
 */
import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Text } from './Text';
import { BookProgressBar } from './BookProgressBar';
import { AuthorLink } from './AuthorLink';
import { GenreLink } from './GenreLink';
import { navigate } from 'gatsby';
import type { Book } from '../types/book';

interface BookCardProps {
  book: Book & { status?: string };
  onClick?: () => void;
  style?: Record<string, any>;
  showStatus?: boolean;
}

export const BookCard = ({ book, onClick, style, showStatus = false }: BookCardProps) => {
  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/book/${book.isbn.replace(/-/g, '')}`);
  };

  return (
    <Card style={style} onClick={onClick}>
      <BookHeader>
        <BookInfo>
          <BookTitle onClick={handleTitleClick}>{book.title}</BookTitle>
          <AuthorName>
            By <AuthorLink authorName={book.author}>{book.author}</AuthorLink>
          </AuthorName>
        </BookInfo>
      </BookHeader>
      <BookContent>
        {book.description?.description && (
          <Text variant="p">{book.description.description}</Text>
        )}
        <MetadataContainer>
          {book.genres && book.genres.length > 0 && (
            <>
              {book.genres.slice(0, 2).map((genre, index) => (
                <GenreLink key={index} genre={genre}>
                  {genre}
                </GenreLink>
              ))}
              {book.genres.length > 2 && (
                <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                  +{book.genres.length - 2} more
                </span>
              )}
            </>
          )}
          {book.communityRating && (
            <RatingTag>⭐ {book.communityRating}</RatingTag>
          )}
        </MetadataContainer>
        {book.progress !== undefined && (
          <BookProgressBar progress={book.progress} />
        )}
      </BookContent>
    </Card>
  );
};

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  width: 100%;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const BookHeader = styled.div`
  margin-bottom: ${theme.spacing.sm};
`;

const BookInfo = styled.div`
  flex: 1;
`;

const BookTitle = styled.div`
  cursor: pointer;
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xs};
  &:hover {
    text-decoration: underline;
  }
`;

const AuthorName = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.secondary};
`;

const BookContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const MetadataContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
  margin-top: ${theme.spacing.xs};
`;

const RatingTag = styled.span`
  background-color: ${theme.colors.secondary};
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
`;
