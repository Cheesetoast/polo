import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { theme } from '../styles/theme';
import { Text } from './Text';
import { StatusIndicator } from './StatusIndicator';
import { BookProgressBar } from './BookProgressBar';
import { Book } from './Book';
import { ReadingStatus } from '../types/reading';

interface BookWithReadingStatus extends Book {
  status?: ReadingStatus;
  progress?: number;
}

interface BookTableProps {
  books: BookWithReadingStatus[];
  onBookClick?: (book: BookWithReadingStatus) => void;
  onAuthorClick?: (authorName: string) => void;
  pageSize?: number;
}

export const BookTable = ({ books, onBookClick, onAuthorClick, pageSize = 10 }: BookTableProps) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  // Reset to page 1 when books array changes (due to filtering)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [books]);

  const totalPages = Math.ceil(books.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentBooks = books.slice(startIndex, endIndex);

  const handleRowClick = (book: BookWithReadingStatus) => {
    if (onBookClick) {
      onBookClick(book);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getBookStatus = (book: BookWithReadingStatus): ReadingStatus => {
    return book.status || 'not-started';
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getRatingDisplay = (book: Book) => {
    if (book.userRating !== undefined && book.userRating !== null) {
      return `${book.userRating.toFixed(1)} (your rating)`;
    }
    if (book.communityRating !== undefined && book.communityRating !== null) {
      return `${book.communityRating.toFixed(1)} (community)`;
    }
    return '-';
  };

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <TableHeaderWithWidth width="35%">Book</TableHeaderWithWidth>
            <TableHeaderWithWidth width="15%">Genre</TableHeaderWithWidth>
            <TableHeaderWithWidth width="15%">Status</TableHeaderWithWidth>
            <TableHeaderWithWidth width="15%">Rating</TableHeaderWithWidth>
            <TableHeaderWithWidth width="10%">Started</TableHeaderWithWidth>
            <TableHeaderWithWidth width="10%">Finished</TableHeaderWithWidth>
          </tr>
        </thead>
        <TableBody>
          {currentBooks.map((book, index) => (
            <TableRow 
              key={book.isbn || index} 
              onClick={() => handleRowClick(book)}
              clickable={!!onBookClick}
            >
              <BookCell>
                <BookInfoContainer>
                  <BookTitleLink to={`/book/${book.isbn.replace(/-/g, '')}`}>
                    <BookTitleText variant="p" weight="medium">{book.title}</BookTitleText>
                  </BookTitleLink>
                  <AuthorInfoContainer>
                    <AuthorLabel variant="caption" color="secondary">By</AuthorLabel>
                    <AuthorLink
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        onAuthorClick?.(book.author);
                      }}
                      clickable={!!onAuthorClick}
                    >
                      {book.author}
                    </AuthorLink>
                  </AuthorInfoContainer>
                  {book.progress !== undefined && (
                    <BookProgressBar progress={book.progress} />
                  )}
                </BookInfoContainer>
              </BookCell>
              <TableCell>
                <Text variant="caption">{book.genre || '-'}</Text>
              </TableCell>
              <TableCell>
                <StatusIndicator status={getBookStatus(book)} size="small" />
              </TableCell>
              <TableCell>
                <Text variant="caption">{getRatingDisplay(book)}</Text>
              </TableCell>
              <TableCell>
                <Text variant="caption">{formatDate(book.dateStarted)}</Text>
              </TableCell>
              <TableCell>
                <Text variant="caption">{formatDate(book.dateFinished)}</Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationInfo>
            <Text variant="caption">
              Showing {startIndex + 1}-{Math.min(endIndex, books.length)} of {books.length} books
            </Text>
          </PaginationInfo>
          
          <PaginationControls>
            <PaginationButton 
              onClick={handlePreviousPage} 
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>
            
            <PaginationNumbers>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationNumber
                  key={page}
                  onClick={() => handlePageChange(page)}
                  active={page === currentPage}
                >
                  {page}
                </PaginationNumber>
              ))}
            </PaginationNumbers>
            
            <PaginationButton 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
            >
              Next
            </PaginationButton>
          </PaginationControls>
        </PaginationContainer>
      )}
    </TableContainer>
  );
};

// Styled Components
const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.muted};
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  flex: 1;
  table-layout: fixed; /* Prevents column width changes */
`;

const TableHeader = styled.th`
  padding: ${theme.spacing.md};
  text-align: left;
  background-color: ${theme.colors.gray?.[50] || '#f9fafb'};
  border-bottom: 2px solid ${theme.colors.muted};
  font-weight: ${theme.fontWeights.bold};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray?.[700] || '#374151'};
  white-space: nowrap; /* Prevents text wrapping */
`;

const TableBody = styled.tbody`
  min-height: 400px; /* Fixed minimum height to prevent jumping */
`;

const TableRow = styled.tr.withConfig({
  shouldForwardProp: (prop) => prop !== 'clickable',
})<{ clickable?: boolean }>`
  border-bottom: 1px solid ${theme.colors.muted};
  transition: background-color 0.2s ease;
  height: 80px; /* Fixed row height to prevent jumping */
  
  ${props => props.clickable && `
    cursor: pointer;
    
    &:hover {
      background-color: ${theme.colors.gray?.[50] || '#f9fafb'};
    }
  `}
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: ${theme.spacing.md};
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BookCell = styled.td`
  padding: ${theme.spacing.md};
  vertical-align: middle;
  word-wrap: break-word;
  white-space: normal;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.muted};
  background-color: ${theme.colors.gray?.[50] || '#f9fafb'};
`;

const PaginationInfo = styled.div`
  color: ${theme.colors.gray?.[600] || '#6b7280'};
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border: 1px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.sm};
  background-color: white;
  color: ${theme.colors.gray?.[600] || '#6b7280'};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${theme.colors.gray?.[50] || '#f9fafb'};
    border-color: ${theme.colors.gray?.[300] || '#d1d5db'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationNumbers = styled.div`
  display: flex;
  gap: 4px;
  margin: 0 ${theme.spacing.sm};
`;

const PaginationNumber = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>`
  padding: ${theme.spacing.xs};
  min-width: 32px;
  height: 32px;
  border: 1px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${props => props.active ? theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : theme.colors.gray?.[600] || '#6b7280'};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${props => props.active ? theme.fontWeights.medium : theme.fontWeights.normal};
  transition: all 0.2s ease;

  &:hover:not([disabled]) {
    background-color: ${props => props.active ? theme.colors.primary : theme.colors.gray?.[50] || '#f9fafb'};
    border-color: ${props => props.active ? theme.colors.primary : theme.colors.gray?.[300] || '#d1d5db'};
  }
`;

const BookTitleLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const AuthorLink = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'clickable',
})<{ clickable?: boolean }>`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray?.[600] || '#6b7280'};
  word-break: break-word;
  
  ${props => props.clickable && `
    cursor: pointer;
    color: ${theme.colors.primary || '#663399'};
    text-decoration: underline;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${theme.colors.primaryDark || '#4a1f7a'};
    }
  `}
`;

export default BookTable;

// Additional styled components for inline styles
const TableHeaderWithWidth = styled(TableHeader)<{ width: string }>`
  width: ${props => props.width};
`;

const BookInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BookTitleText = styled(Text)`
  word-break: break-word;
`;

const AuthorInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AuthorLabel = styled(Text)`
  word-break: break-word;
`;
