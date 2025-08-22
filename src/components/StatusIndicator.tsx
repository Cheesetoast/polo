import styled from 'styled-components';
import { theme } from '../styles/theme';
import { ReadingStatus } from '../types/reading';

interface StatusIndicatorProps {
  status: ReadingStatus | null;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export const StatusIndicator = ({ 
  status, 
  size = 'medium', 
  showLabel = true 
}: StatusIndicatorProps) => {
  const getStatusLabel = (status: ReadingStatus | null): string => {
    if (!status) return 'No Status';
    
    switch (status) {
      case 'want-to-read':
        return 'Want to Read';
      case 'currently-reading':
        return 'Currently Reading';
      case 'finished':
        return 'Finished';
      default:
        return status;
    }
  };

  return (
    <StatusContainer>
      <StatusDot status={status} size={size} />
      {showLabel && <StatusLabel status={status}>{getStatusLabel(status)}</StatusLabel>}
    </StatusContainer>
  );
};

// Styled Components
const StatusDot = styled.div.withConfig({
  shouldForwardProp: (prop) => !['status', 'size'].includes(prop),
})<{ status: ReadingStatus | null; size: string }>`
  width: ${props => props.size === 'small' ? '8px' : props.size === 'large' ? '16px' : '12px'};
  height: ${props => props.size === 'small' ? '8px' : props.size === 'large' ? '16px' : '12px'};
  border-radius: 50%;
  background-color: ${props => {
    if (!props.status) return theme.colors.muted;
    
    switch (props.status) {
      case 'want-to-read':
        return theme.colors.error || '#ef4444';
      case 'currently-reading':
        return theme.colors.warning || '#f59e0b';
      case 'finished':
        return theme.colors.success || '#10b981';
      default:
        return theme.colors.muted;
    }
  }};
  display: inline-block;
  margin-right: ${props => props.size === 'small' ? '4px' : '8px'};
`;

const StatusLabel = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: ReadingStatus | null }>`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${props => {
    if (!props.status) return theme.colors.muted;
    
    switch (props.status) {
      case 'want-to-read':
        return theme.colors.error || '#ef4444';
      case 'currently-reading':
        return theme.colors.warning || '#f59e0b';
      case 'finished':
        return theme.colors.success || '#10b981';
      default:
        return theme.colors.muted;
    }
  }};
  text-transform: capitalize;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;
