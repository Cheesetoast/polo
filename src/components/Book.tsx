import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { ImageBlock } from './ImageBlock';
import { Text } from './Text';
import { DEFAULTS } from '../constants';

export interface BookData {
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
}

export interface BookProps {
    book: BookData;
}

const StyledBook = styled.div`
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

export const Book: React.FC<BookProps> = ({ book }) => {
    return (
        <StyledBook>
            <BookHeader>
                <Text variant="h3" style={{ marginBottom: theme.spacing.xs }}>
                    {book.title}
                </Text>
                <Text variant="p" color="secondary">
                    By {book.author}
                </Text>
            </BookHeader>

            <BookContent>
                {book.description?.description && (
                    <Text variant="p">
                        {book.description.description}
                    </Text>
                )}
                
                {book.image?.gatsbyImageData && (
                    <ImageBlock
                        image={book.image.gatsbyImageData}
                        alt={book.image.title || DEFAULTS.FALLBACK_BOOK_COVER}
                    />
                )}
            </BookContent>

            {book.isbn && (
                <BookFooter>
                    <Text variant="caption">ISBN: {book.isbn}</Text>
                </BookFooter>
            )}
        </StyledBook>
    );
};

export default Book;
