/**
 * Static (non-drag) book board for SSR compatibility.
 * Same three-column layout with status dropdown to move books — no @dnd-kit.
 */
import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Text } from './Text';
import { ReadingStatus } from '../types/reading';
import { navigate } from 'gatsby';

interface BookWithStatus {
  isbn: string;
  title: string;
  author: string;
  description?: { description: string };
  status: ReadingStatus | null;
  [key: string]: any;
}

interface BookBoardStaticProps {
  booksWithStatus: BookWithStatus[];
  updateBookStatus: (isbn: string | undefined, status: ReadingStatus | null) => void;
}

const COLUMNS: { status: ReadingStatus; title: string; color: string }[] = [
  { status: 'want-to-read', title: 'Want to Read', color: '#e74c3c' },
  { status: 'currently-reading', title: 'Currently Reading', color: '#f39c12' },
  { status: 'finished', title: 'Finished', color: '#27ae60' },
];

export const BookBoardStatic = React.memo(({ booksWithStatus, updateBookStatus }: BookBoardStaticProps) => {
  const getBooksByStatus = (status: ReadingStatus) =>
    booksWithStatus.filter((book) => book.status === status);
  const totalAssigned = booksWithStatus.filter((book) => book.status !== null).length;

  return (
    <BoardContainer>
      <BoardTitle>
        My Reading Board
        {totalAssigned > 0 && (
          <BoardSubtitle>
            {totalAssigned} book{totalAssigned !== 1 ? 's' : ''} organized
          </BoardSubtitle>
        )}
      </BoardTitle>

      {totalAssigned === 0 ? (
        <EmptyState>
          <div>
            <h3>No books organized yet</h3>
            <p>Start by assigning a status to a book from the book detail page</p>
          </div>
        </EmptyState>
      ) : (
        <ColumnsContainer>
          {COLUMNS.map(({ status, title, color }) => (
            <Column key={status}>
              <ColumnHeader $backgroundColor={color}>
                <ColumnTitle>{title}</ColumnTitle>
                <BookCount>{getBooksByStatus(status).length}</BookCount>
              </ColumnHeader>
              <ColumnContent>
                {getBooksByStatus(status).map((book) => (
                  <Card key={book.isbn}>
                    <CardTitle onClick={() => navigate(`/book/${book.isbn.replace(/-/g, '')}`)}>
                      {book.title}
                    </CardTitle>
                    <Text variant="caption" color="secondary">
                      {book.author}
                    </Text>
                    <StatusSelect
                      value={book.status || ''}
                      onChange={(e) => {
                        const v = e.target.value as ReadingStatus | '';
                        updateBookStatus(book.isbn, v || null);
                      }}
                    >
                      <option value="">Move to...</option>
                      {COLUMNS.map((c) => (
                        <option key={c.status} value={c.status}>
                          {c.title}
                        </option>
                      ))}
                    </StatusSelect>
                  </Card>
                ))}
              </ColumnContent>
            </Column>
          ))}
        </ColumnsContainer>
      )}
    </BoardContainer>
  );
});

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  min-height: 400px;
`;

const BoardTitle = styled.h2`
  text-align: center;
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
`;

const BoardSubtitle = styled.div`
  text-align: center;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.secondary};
  margin-top: ${theme.spacing.xs};
`;

const ColumnsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.md};
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  min-height: 400px;
`;

const ColumnHeader = styled.div<{ $backgroundColor?: string }>`
  background: ${(p) => p.$backgroundColor || theme.colors.primary};
  color: white;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
  font-weight: ${theme.fontWeights.semibold};
  font-size: ${theme.fontSizes.lg};
`;

const ColumnTitle = styled.h3`
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.bold};
  color: white;
  margin-bottom: ${theme.spacing.sm};
`;

const BookCount = styled.div`
  font-size: ${theme.fontSizes.sm};
  opacity: 0.8;
`;

const ColumnContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${theme.spacing.sm};
  flex: 1;
  padding: ${theme.spacing.sm};
  background: ${theme.colors.muted}20;
  border-radius: ${theme.borderRadius.md};
  border: 2px dashed ${theme.colors.muted}40;
`;

const Card = styled.div`
  background: white;
  border: 1px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardTitle = styled.div`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const StatusSelect = styled.select`
  margin-top: 4px;
  padding: 4px 8px;
  font-size: ${theme.fontSizes.xs};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.muted};
  cursor: pointer;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${theme.colors.muted};
  font-style: italic;
  text-align: center;
`;
