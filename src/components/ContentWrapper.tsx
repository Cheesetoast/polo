import { type ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

export interface ContentWrapperProps {
  children: ReactNode;
  as?: 'div' | 'section' | 'article' | 'main';
  className?: string;
}

export const ContentWrapper = ({ 
  children, 
  className,
  as = 'div'
}: ContentWrapperProps) => {
  return (
    <StyledContentWrapper as={as} className={className}>
      {children}
    </StyledContentWrapper>
  );
};

// Styled Components
const StyledContentWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 1280px;
  min-width: 0;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  overflow-x: clip;

  @media (min-width: 768px) {
    padding: 0 ${theme.spacing["2xl"]};
  }

  @media (min-width: 1024px) {
    padding: 0 ${theme.spacing["3xl"]};
  }
`;
