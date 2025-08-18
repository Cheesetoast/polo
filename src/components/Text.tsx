import { type ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { theme, type FontSize, type FontWeight, type Color } from '../styles/theme';

export interface TextProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label' | 'caption';
  size?: FontSize;
  weight?: FontWeight;
  color?: Color;
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  style?: Record<string, any>; // Generic CSS properties
}

export const Text = ({
  children,
  variant = 'p',
  size,
  weight,
  color,
  align,
  truncate = false,
  className,
  as,
  style,
  ...props
}: TextProps) => {
  // Determine the HTML element to render
  const getElement = () => {
    if (as) return as;
    
    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'p':
      case 'label':
        return variant;
      case 'caption':
        return 'span';
      default:
        return 'span';
    }
  };

  return (
    <StyledText
      as={getElement()}
      variant={variant}
      size={size}
      weight={weight}
      color={color}
      align={align}
      truncate={truncate}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </StyledText>
  );
};

export default Text;

// Styled Components
const StyledText = styled.div.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size', 'weight', 'color', 'align', 'truncate'].includes(prop),
})<TextProps>`
  margin: 0;
  line-height: 1.5;
  
  ${({ truncate }) => truncate && css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}

  /* Text alignment */
  ${({ align = 'left' }) => css`
    text-align: ${align};
  `}

  /* Font weight */
  ${({ weight = 'normal' }) => css`
    font-weight: ${theme.fontWeights[weight]};
  `}

  /* Font size */
  ${({ size = 'base' }) => css`
    font-size: ${theme.fontSizes[size]};
    line-height: ${theme.lineHeights[size]};
  `}

  /* Color variants */
  ${({ color = 'primary' }) => css`
    color: ${theme.colors[color]};
  `}

  /* Variant-specific styles */
  ${({ variant }) => {
    switch (variant) {
      case 'h1':
        return css`
          font-size: ${theme.fontSizes['5xl']};
          font-weight: ${theme.fontWeights.bold};
          line-height: ${theme.lineHeights['5xl']};
          margin-bottom: ${theme.spacing.lg};
        `;
      case 'h2':
        return css`
          font-size: ${theme.fontSizes['4xl']};
          font-weight: ${theme.fontWeights.bold};
          line-height: ${theme.lineHeights['4xl']};
          margin-bottom: ${theme.spacing.lg};
        `;
      case 'h3':
        return css`
          font-size: ${theme.fontSizes['3xl']};
          font-weight: ${theme.fontWeights.semibold};
          line-height: ${theme.lineHeights['3xl']};
          margin-bottom: ${theme.spacing.md};
        `;
      case 'h4':
        return css`
          font-size: ${theme.fontSizes['2xl']};
          font-weight: ${theme.fontWeights.semibold};
          line-height: ${theme.lineHeights['2xl']};
          margin-bottom: ${theme.spacing.md};
        `;
      case 'h5':
        return css`
          font-size: ${theme.fontSizes.xl};
          font-weight: ${theme.fontWeights.semibold};
          line-height: ${theme.lineHeights.xl};
          margin-bottom: ${theme.spacing.sm};
        `;
      case 'h6':
        return css`
          font-size: ${theme.fontSizes.lg};
          font-weight: ${theme.fontWeights.semibold};
          line-height: ${theme.lineHeights.lg};
          margin-bottom: ${theme.spacing.sm};
        `;
      case 'p':
        return css`
          margin-bottom: ${theme.spacing.md};
          &:last-child {
            margin-bottom: 0;
          }
        `;
      case 'label':
        return css`
          font-weight: ${theme.fontWeights.medium};
          margin-bottom: ${theme.spacing.xs};
          display: block;
        `;
      case 'caption':
        return css`
          font-size: ${theme.fontSizes.xs};
          color: ${theme.colors.secondary};
          line-height: ${theme.lineHeights.xs};
        `;
      default:
        return css``;
    }
  }}
`;
