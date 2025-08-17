import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Text } from './Text';

interface DashboardStats {
  totalBooks: number;
  finishedBooks: number;
  currentlyReading: number;
  wantToRead: number;
  topGenres: string[];
  averageRating: string;
  typeCounts: Record<string, number>;
}

interface DashboardProps {
  stats: DashboardStats;
  className?: string;
  style?: React.CSSProperties;
}

export const Dashboard = ({ stats, className, style }: DashboardProps) => {
  return (
    <DashboardContainer className={className} style={style}>
      <Text variant="h3" style={{ marginBottom: theme.spacing.md }}>
        Reading Statistics
      </Text>
      
      <StatsGrid>
        <StatCard>
          <StatNumber>{stats.totalBooks}</StatNumber>
          <StatLabel>Total Books</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatNumber>{stats.finishedBooks}</StatNumber>
          <StatLabel>Finished</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatNumber>{stats.currentlyReading}</StatNumber>
          <StatLabel>Currently Reading</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatNumber>{stats.wantToRead}</StatNumber>
          <StatLabel>Want to Read</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <StatsDetails>
        <StatSection>
          <Text variant="h4" style={{ marginBottom: theme.spacing.sm }}>
            Top Genres
          </Text>
          {stats.topGenres.length > 0 ? (
            <GenreList>
              {stats.topGenres.map((genre, index) => (
                <GenreTag key={index}>{genre}</GenreTag>
              ))}
            </GenreList>
          ) : (
            <Text variant="p" color="secondary">No genre data available</Text>
          )}
        </StatSection>
        
        <StatSection>
          <Text variant="h4" style={{ marginBottom: theme.spacing.sm }}>
            Average Rating
          </Text>
          <Text variant="p" size="lg" weight="semibold">
            {stats.averageRating} / 5
          </Text>
        </StatSection>
        
        <StatSection>
          <Text variant="h4" style={{ marginBottom: theme.spacing.sm }}>
            Book Types
          </Text>
          {Object.keys(stats.typeCounts).length > 0 ? (
            <TypeList>
              {Object.entries(stats.typeCounts).map(([type, count]) => (
                <TypeTag key={type}>
                  {type}: {count}
                </TypeTag>
              ))}
            </TypeList>
          ) : (
            <Text variant="p" color="secondary">No type data available</Text>
          )}
        </StatSection>
      </StatsDetails>
    </DashboardContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
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
  background: ${theme.colors.muted}10;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.muted}20;
`;

const StatNumber = styled.div`
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xs};
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

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
`;

const GenreTag = styled.span`
  background: ${theme.colors.primary};
  color: white;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
`;

const TypeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const TypeTag = styled.span`
  background: ${theme.colors.secondary};
  color: white;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
`;