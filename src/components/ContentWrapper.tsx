import React from 'react';
import styled from 'styled-components';

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

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

export const ContentWrapper: React.FC<ContentWrapperProps> = ({ 
  children, 
  className,
  as = 'div'
}) => {
  return (
    <StyledContentWrapper as={as} className={className}>
      {children}
    </StyledContentWrapper>
  );
};
