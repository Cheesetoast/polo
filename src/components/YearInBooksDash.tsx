import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Text } from './Text';
import { Book } from './Book';

interface YearInBooksStats {
  booksRead: number;
  pagesRead: number;
  averageRating: number;
  topBooks: Book[];
  favoriteGenre: string;
}

interface YearInBooksDashProps {
  stats: YearInBooksStats;
  className?: string;
  style?: React.CSSProperties;
}

export const YearInBooksDash = ({ stats, className, style }: YearInBooksDashProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <YearInBooksContainer className={className} style={style}>
      <YearInBooksTitle variant="h3">
        {currentYear} in Books
      </YearInBooksTitle>
      
      <StatsGrid>
        <StatCard>
          <StatNumber>{stats.booksRead}</StatNumber>
          <StatLabel>Books Read</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatNumber>{stats.pagesRead.toLocaleString()}</StatNumber>
          <StatLabel>Pages Read</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatNumber>{stats.averageRating.toFixed(1)}</StatNumber>
          <StatLabel>Average Rating</StatLabel>
        </StatCard>
        

      </StatsGrid>
      
      <StatsDetails>
        <StatSection>
          <SectionTitle variant="h4">
            Favorite Genre
          </SectionTitle>
          <Text variant="p" size="lg" weight="semibold">
            {stats.favoriteGenre}
          </Text>
        </StatSection>
        
        <StatSection>
          <SectionTitle variant="h4">
            Top Books This Year
          </SectionTitle>
          {stats.topBooks.length > 0 ? (
            <TopBooksList>
              {stats.topBooks.slice(0, 3).map((book, index) => (
                <TopBookItem key={book.isbn}>
                  <BookRank>#{index + 1}</BookRank>
                                     <BookInfo>
                     <BookTitleText variant="p" weight="medium">
                       {book.title}
                     </BookTitleText>
                     <Text variant="caption" color="secondary">
                       {book.author} • {((book.userRating !== undefined && book.userRating !== null ? book.userRating : book.communityRating) || 0).toFixed(1)}/5
                     </Text>
                   </BookInfo>
                </TopBookItem>
              ))}
            </TopBooksList>
          ) : (
            <Text variant="p" color="secondary">No books read yet this year</Text>
          )}
        </StatSection>
      </StatsDetails>
    </YearInBooksContainer>
  );
};

export default YearInBooksDash;

// Styled Components
const YearInBooksContainer = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const StatCard = styled.div`
  text-align: center;
  padding: ${theme.spacing.md};
  background: ${theme.colors.primary}10;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.primary}20;
`;

const StatNumber = styled.div`
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const YearInBooksTitle = styled(Text)`
  margin-bottom: ${theme.spacing.md};
`;

const SectionTitle = styled(Text)`
  margin-bottom: ${theme.spacing.sm};
`;

const BookTitleText = styled(Text)`
  margin-bottom: 2px;
`;

const StatLabel = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.secondary};
  font-weight: ${theme.fontWeights.medium};
`;

const StatsDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
`;

const StatSection = styled.div`
  padding: ${theme.spacing.md};
  background: ${theme.colors.muted}05;
  border-radius: ${theme.borderRadius.md};
`;

const TopBooksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const TopBookItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.muted}20;
`;

const BookRank = styled.div`
  background: ${theme.colors.primary};
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.bold};
  flex-shrink: 0;
`;

const BookInfo = styled.div`
  flex: 1;
`;
