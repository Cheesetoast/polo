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
}

interface DashboardProps {
  stats: DashboardStats;
  className?: string;
  style?: Record<string, any>; // Generic CSS properties
}

export const Dashboard = ({ stats, className, style }: DashboardProps) => {
  return (
    <DashboardContainer className={className} style={style}>
      <DashboardTitle variant="h3">
        Reading Statistics
      </DashboardTitle>
      
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
          <SectionTitle variant="h4">
            Top Genres
          </SectionTitle>
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
          <SectionTitle variant="h4">
            Average Rating
          </SectionTitle>
          <Text variant="p" size="lg" weight="semibold">
            {stats.averageRating} / 5
          </Text>
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

const DashboardTitle = styled(Text)`
  margin-bottom: ${theme.spacing.md};
`;

const SectionTitle = styled(Text)`
  margin-bottom: ${theme.spacing.sm};
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

