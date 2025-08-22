import React, { useEffect, useMemo } from 'react';
import { navigate } from 'gatsby';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { ContentWrapper } from '../components/ContentWrapper';
import { Text } from '../components/Text';
import { BookBoard } from '../components/BookBoard';
import { Button } from '../components/Button';
import { useBookStatus } from '../hooks/useBookStatus';
import booksData from '../data/books.json';
import { theme } from '../styles/theme';

// Move booksData to a constant outside the component to prevent re-creation on each render
const BOOKS_DATA = booksData;

const BookshelfPage = () => {
  const { booksWithStatus, updateBookStatus, resetStatuses, clearLocalStorage } = useBookStatus(BOOKS_DATA);

  // Filter out books with null status (unassigned books)
  const booksWithAssignedStatus = booksWithStatus.filter(book => book.status !== null);

  const handleBookStatusChange = (isbn: string, status: any) => {
    updateBookStatus(isbn, status);
  };

  const handleGoToSearch = () => {
    navigate('/search');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <Layout>
      <ContentWrapper>
        <PageHeader>
          <Text variant="h1">My Bookshelf</Text>
          <Text variant="p" color="secondary">
            Organize your reading journey with this visual Kanban board
          </Text>
        </PageHeader>

        <StatsSection>
          <StatCard>
            <Text variant="h3" weight="bold">{booksWithAssignedStatus.length}</Text>
            <Text variant="caption" color="secondary">Books Organized</Text>
          </StatCard>
          <StatCard>
            <Text variant="h3" weight="bold">
              {booksWithAssignedStatus.filter(book => book.status === 'want-to-read').length}
            </Text>
            <Text variant="caption" color="secondary">Want to Read</Text>
          </StatCard>
          <StatCard>
            <Text variant="h3" weight="bold">
              {booksWithAssignedStatus.filter(book => book.status === 'currently-reading').length}
            </Text>
            <Text variant="caption" color="secondary">Currently Reading</Text>
          </StatCard>
          <StatCard>
            <Text variant="h3" weight="bold">
              {booksWithAssignedStatus.filter(book => book.status === 'finished').length}
            </Text>
            <Text variant="caption" color="secondary">Finished</Text>
          </StatCard>
        </StatsSection>

        <ActionSection>
          <Button onClick={handleGoToSearch} variant="primary">
            Add More Books
          </Button>
          <Button onClick={handleGoToHome} variant="secondary">
            Back to Dashboard
          </Button>
        </ActionSection>

                  {booksWithAssignedStatus.length > 0 ? (
            <BookBoard 
              booksWithStatus={booksWithStatus}
              updateBookStatus={updateBookStatus}
            />
          ) : (
          <EmptyState>
            <Text variant="h2" align="center">No books organized yet</Text>
            <Text variant="p" color="secondary" align="center">
              Start by adding books to your reading list from the search page
            </Text>
            <Button onClick={handleGoToSearch} variant="primary" size="large">
              Find Your Next Book
            </Button>
          </EmptyState>
        )}

        <ManagementSection>
          <Text variant="h3">Bookshelf Management</Text>
          <Text variant="p" color="secondary">
            Manage your reading organization and reset statuses if needed
          </Text>
          <ButtonContainer>
            <Button onClick={resetStatuses} variant="outline">
              Reset All Statuses
            </Button>
            <Button onClick={clearLocalStorage} variant="outline">
              Clear Local Storage
            </Button>
          </ButtonContainer>
        </ManagementSection>
      </ContentWrapper>
    </Layout>
  );
};

export default BookshelfPage;

// Styled Components
const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  
  h1 {
    margin-bottom: ${theme.spacing.sm};
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray[600]};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  text-align: center;
  
  h3 {
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.xs};
  }
`;

const ActionSection = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  background: ${theme.colors.muted}10;
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.xl} 0;
  
  h2 {
    margin-bottom: ${theme.spacing.md};
  }
  
  p {
    margin-bottom: ${theme.spacing.lg};
  }
`;

const ManagementSection = styled.div`
  margin-top: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.muted}10;
  border-radius: ${theme.borderRadius.lg};
  text-align: center;
  
  h3 {
    margin-bottom: ${theme.spacing.sm};
  }
  
  p {
    margin-bottom: ${theme.spacing.lg};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;
