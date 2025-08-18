import { type ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../styles/theme';

export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  className?: string;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
  className,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      type={type}
      fullWidth={fullWidth}
      className={className}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

// Styled Components
const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size', 'fullWidth'].includes(prop),
})<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  outline: none;
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}

  /* Size variants */
  ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.fontSizes.sm};
          min-height: 36px;
        `;
      case 'large':
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.fontSizes.lg};
          min-height: 56px;
        `;
      default: // medium
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: ${theme.fontSizes.base};
          min-height: 44px;
        `;
    }
  }}

  /* Variant styles */
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.white};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray[600]};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.blue[500]};
          border: 2px solid ${theme.colors.blue[500]};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.blue[500]};
            color: ${theme.colors.white};
          }
        `;
      default: // primary
        return css`
          background-color: ${theme.colors.blue[500]};
          color: ${theme.colors.white};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.blue[600]};
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }
        `;
    }
  }}

  /* Disabled state */
  ${({ disabled }) => disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  `}

  /* Focus state */
  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;
