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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  
  @media (min-width: 768px) {
    padding: 0 48px;
  }
  
  @media (min-width: 1024px) {
    padding: 0 64px;
  }
`;
