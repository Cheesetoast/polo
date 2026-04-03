import React, { useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { navigate } from 'gatsby';
import { theme } from '../styles/theme';
import { Text } from './Text';
import { ReadingStatus } from '../types/reading';

const ISBN_MIME = 'text/plain';

export interface BookBoardStaticProps {
  booksWithStatus: Array<{
    isbn: string;
    title: string;
    author: string;
    description: { description: string };
    status: ReadingStatus | null;
    [key: string]: any;
  }>;
  updateBookStatus: (isbn: string | undefined, status: ReadingStatus | null) => void;
}

const COLUMNS: { status: ReadingStatus; title: string; color: string }[] = [
  { status: 'want-to-read', title: 'Want to Read', color: '#e74c3c' },
  { status: 'currently-reading', title: 'Currently Reading', color: '#f39c12' },
  { status: 'finished', title: 'Finished', color: '#27ae60' },
];

export const BookBoardStatic = React.memo(
  ({ booksWithStatus, updateBookStatus }: BookBoardStaticProps) => {
    const [draggedIsbn, setDraggedIsbn] = useState<string | null>(null);
    const [dropTarget, setDropTarget] = useState<ReadingStatus | null>(null);

    const getBooksByStatus = (status: ReadingStatus) =>
      booksWithStatus.filter((book) => book.status === status);

    const getTotalAssignedBooks = () =>
      booksWithStatus.filter((book) => book.status !== null).length;

    const endDrag = useCallback(() => {
      setDraggedIsbn(null);
      setDropTarget(null);
    }, []);

    return (
      <BoardContainer>
        <BoardTitle>
          My Reading Board
          {getTotalAssignedBooks() > 0 && (
            <BoardSubtitle>
              {getTotalAssignedBooks()} book
              {getTotalAssignedBooks() !== 1 ? 's' : ''} organized
            </BoardSubtitle>
          )}
        </BoardTitle>

        {getTotalAssignedBooks() === 0 ? (
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
                <ColumnContent
                  $isDropTarget={dropTarget === status}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    setDropTarget(status);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setDropTarget(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const isbn = e.dataTransfer.getData(ISBN_MIME);
                    if (isbn) {
                      updateBookStatus(isbn, status);
                    }
                    endDrag();
                  }}
                >
                  {getBooksByStatus(status).map((book) => (
                    <BookCard
                      key={book.isbn}
                      $isDragging={draggedIsbn === book.isbn}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData(ISBN_MIME, book.isbn);
                        e.dataTransfer.effectAllowed = 'move';
                        setDraggedIsbn(book.isbn);
                      }}
                      onDragEnd={endDrag}
                    >
                      <DragHandle aria-label="Drag to move book">
                        <GripIcon viewBox="0 0 24 24" aria-hidden>
                          <circle cx="9" cy="7" r="1.75" fill="currentColor" />
                          <circle cx="15" cy="7" r="1.75" fill="currentColor" />
                          <circle cx="9" cy="12" r="1.75" fill="currentColor" />
                          <circle cx="15" cy="12" r="1.75" fill="currentColor" />
                          <circle cx="9" cy="17" r="1.75" fill="currentColor" />
                          <circle cx="15" cy="17" r="1.75" fill="currentColor" />
                        </GripIcon>
                      </DragHandle>
                      <BookCardHeader>
                        <BookTitleButton
                          type="button"
                          onClick={() =>
                            navigate(`/book/${book.isbn.replace(/-/g, '')}`)
                          }
                        >
                          {book.title}
                        </BookTitleButton>
                        <Text variant="caption" color="secondary">
                          {book.author}
                        </Text>
                      </BookCardHeader>
                      <StatusRow>
                        <StatusLabel htmlFor={`status-${book.isbn}`}>
                          Or move to
                        </StatusLabel>
                        <StatusSelect
                          id={`status-${book.isbn}`}
                          value={book.status || ''}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v === '') {
                              updateBookStatus(book.isbn, null);
                            } else {
                              updateBookStatus(book.isbn, v as ReadingStatus);
                            }
                          }}
                        >
                          <option value="want-to-read">Want to Read</option>
                          <option value="currently-reading">Currently Reading</option>
                          <option value="finished">Finished</option>
                        </StatusSelect>
                      </StatusRow>
                    </BookCard>
                  ))}
                </ColumnContent>
              </Column>
            ))}
          </ColumnsContainer>
        )}
      </BoardContainer>
    );
  }
);

BookBoardStatic.displayName = 'BookBoardStatic';

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
  font-weight: ${theme.fontWeights.normal};
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
    gap: ${theme.spacing.md};
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  min-height: 400px;
`;

const ColumnHeader = styled.div<{ $backgroundColor: string }>`
  background: ${(p) => p.$backgroundColor};
  color: ${theme.colors.white};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
  font-weight: ${theme.fontWeights.semibold};
  font-size: ${theme.fontSizes.lg};
`;

const ColumnTitle = styled.h3`
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.white};
  margin-bottom: ${theme.spacing.sm};
`;

const BookCount = styled.div`
  font-size: ${theme.fontSizes.sm};
  opacity: 0.8;
`;

const ColumnContent = styled.div<{ $isDropTarget?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${theme.spacing.md};
  flex: 1;
  padding: ${theme.spacing.sm};
  background: ${theme.colors.muted}20;
  border-radius: ${theme.borderRadius.md};
  border: 2px dashed ${theme.colors.muted}40;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  ${({ $isDropTarget }) =>
    $isDropTarget &&
    css`
      background: rgba(0, 113, 227, 0.06);
      border-color: ${theme.colors.blue[500]};
      box-shadow: inset 0 0 0 1px ${theme.colors.blue[500]};
    `}
`;

const BookCard = styled.div<{ $isDragging?: boolean }>`
  position: relative;
  width: 100%;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  box-shadow: ${theme.shadows.sm};
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  ${({ $isDragging }) =>
    $isDragging &&
    css`
      opacity: 0.55;
    `}
`;

const DragHandle = styled.div`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.secondary};
  line-height: 0;
  box-shadow: ${theme.shadows.sm};
  user-select: none;
  pointer-events: none;
`;

const GripIcon = styled.svg`
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  display: block;
`;

const BookCardHeader = styled.div`
  margin-bottom: ${theme.spacing.sm};
  padding-right: 40px;
`;

const BookTitleButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.blue[500]};
  font-family: ${theme.fontFamily};

  &:hover {
    text-decoration: underline;
  }
`;

const StatusRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const StatusLabel = styled.label`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.secondary};
`;

const StatusSelect = styled.select`
  width: 100%;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  font-family: ${theme.fontFamily};
  background: ${theme.colors.surface};
  color: ${theme.colors.primary};

  &:focus {
    outline: none;
    border-color: ${theme.colors.blue[500]};
    box-shadow: 0 0 0 2px rgba(0, 113, 227, 0.2);
  }
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

export default BookBoardStatic;
