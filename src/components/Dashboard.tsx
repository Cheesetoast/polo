import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Text } from './Text';
import { Button } from './Button';
import { navigate } from 'gatsby';
import { GenreLink } from './GenreLink';

interface DashboardStats {
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
          <StatNumber>{stats.wantToRead}</StatNumber>
          <StatLabel>Want to Read</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber>{stats.currentlyReading}</StatNumber>
          <StatLabel>Currently Reading</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber>{stats.finishedBooks}</StatNumber>
          <StatLabel>Finished</StatLabel>
        </StatCard>
      </StatsGrid>

      <StatsDetails>
        <StatSection>
          <SectionTitle variant="h4">
            Top Genres
          </SectionTitle>
          {stats.topGenres.length > 0 ? (
            <>
              <GenreList>
                {stats.topGenres.map((genre, index) => (
                  <GenreLink 
                    key={index}
                    genre={genre}
                  >
                    {genre}
                  </GenreLink>
                ))}
              </GenreList>
            </>
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
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.sm};
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
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
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
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
`;

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
`;

const GenreTag = styled.span`
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
`;

const ViewAllGenresButton = styled(Button)`
  margin-top: ${theme.spacing.sm};
  width: 100%;
`;