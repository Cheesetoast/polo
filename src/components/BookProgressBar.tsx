import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Text } from './Text';

interface BookProgressBarProps {
    progress: number;
    className?: string;
    style?: React.CSSProperties;
}

export const BookProgressBar = ({ progress, className, style }: BookProgressBarProps) => {
    // Clamp progress between 0 and 100, default to 0 if undefined
    const displayProgress = Math.min(Math.max(progress ?? 0, 0), 100);
    
    return (
        <ProgressBarContainer className={className} style={style}>
            <ProgressHeader>
                <Text variant="caption">Progress</Text>
                <Text variant="caption">{displayProgress}%</Text>
            </ProgressHeader>
            <ProgressBarTrack>
                <ProgressBarFill progress={displayProgress} />
            </ProgressBarTrack>
        </ProgressBarContainer>
    );
};

export default BookProgressBar;

// Styled Components
const ProgressBarContainer = styled.div`
    margin-top: ${theme.spacing.xs};
`;

const ProgressHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
`;

const ProgressBarTrack = styled.div`
    width: 100%;
    height: 6px;
    background-color: ${theme.colors.muted};
    border-radius: ${theme.borderRadius.sm};
    overflow: hidden;
`;

const ProgressBarFill = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'progress',
})<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background-color: ${theme.colors.primary};
  transition: width 0.3s ease;
`;
