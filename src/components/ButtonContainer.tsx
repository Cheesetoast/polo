import { type ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

export interface ButtonContainerProps {
  children: ReactNode;
  direction?: 'horizontal' | 'vertical';
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
  style?: Record<string, any>; // Generic CSS properties
}

export const ButtonContainer = ({
  children,
  direction = 'horizontal',
  spacing = 'md',
  alignment = 'center',
  className,
  style,
}: ButtonContainerProps) => {
  return (
    <StyledButtonContainer
      direction={direction}
      spacing={spacing}
      alignment={alignment}
      className={className}
      style={style}
    >
      {children}
    </StyledButtonContainer>
  );
};

// Styled Components
const StyledButtonContainer = styled.div<Omit<ButtonContainerProps, 'children' | 'className' | 'style'>>`
  display: flex;
  flex-direction: ${props => props.direction === 'vertical' ? 'column' : 'row'};
  gap: ${props => {
    switch (props.spacing) {
      case 'xs': return theme.spacing.xs;
      case 'sm': return theme.spacing.sm;
      case 'lg': return theme.spacing.lg;
      case 'md':
      default: return theme.spacing.md;
    }
  }};
  align-items: ${props => {
    switch (props.alignment) {
      case 'start': return 'flex-start';
      case 'end': return 'flex-end';
      case 'stretch': return 'stretch';
      case 'center':
      default: return 'center';
    }
  }};
  justify-content: ${props => {
    if (props.direction === 'vertical') {
      switch (props.alignment) {
        case 'start': return 'flex-start';
        case 'end': return 'flex-end';
        case 'stretch': return 'stretch';
        case 'center':
        default: return 'center';
      }
    } else {
      switch (props.alignment) {
        case 'start': return 'flex-start';
        case 'end': return 'flex-end';
        case 'stretch': return 'space-between';
        case 'center':
        default: return 'center';
      }
    }
  }};
  
  /* Responsive behavior */
  @media (max-width: 768px) {
    flex-direction: ${props => props.direction === 'horizontal' ? 'column' : props.direction};
    gap: ${theme.spacing.sm};
  }
`;