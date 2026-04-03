import {
  type ReactNode,
  forwardRef,
  type ButtonHTMLAttributes,
} from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../styles/theme';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'muted'
  | 'pagination';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  /** For `muted` + `fullWidth`: left-align label (e.g. author chips). */
  contentAlign?: 'center' | 'start';
  /** Current page highlight for `variant="pagination"`. */
  pageActive?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      disabled = false,
      fullWidth = false,
      contentAlign = 'center',
      pageActive = false,
      type = 'button',
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled}
        fullWidth={fullWidth}
        contentAlign={contentAlign}
        pageActive={pageActive}
        type={type}
        className={className}
        {...rest}
      >
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;

type StyledProps = ButtonProps;

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) =>
    !['variant', 'size', 'fullWidth', 'contentAlign', 'pageActive'].includes(
      prop
    ),
})<StyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: ${({ contentAlign = 'center' }) =>
    contentAlign === 'start' ? 'flex-start' : 'center'};
  border-style: solid;
  border-width: 0;
  border-radius: ${theme.borderRadius.lg};
  font-family: ${theme.fontFamily};
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
  text-decoration: none;
  outline: none;

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ variant, size = 'medium', pageActive }) => {
    if (variant === 'ghost') {
      return css`
        background: transparent;
        border: none;
        color: ${theme.colors.blue[500]};
        padding: ${theme.spacing.sm} 0;
        min-height: auto;
        font-weight: 500;
        box-shadow: none;
        border-radius: ${theme.borderRadius.sm};
        &:hover:not(:disabled) {
          color: ${theme.colors.secondary};
          text-decoration: underline;
          transform: none;
          box-shadow: none;
        }
        &:focus-visible {
          box-shadow: 0 0 0 2px rgba(0, 113, 227, 0.35);
        }
      `;
    }

    if (variant === 'muted') {
      return css`
        background: ${theme.colors.surface};
        color: ${theme.colors.secondary};
        border-width: 1px;
        border-color: ${theme.colors.border};
        font-weight: 500;
        ${size === 'small'
          ? css`
              padding: ${theme.spacing.xs} ${theme.spacing.md};
              font-size: ${theme.fontSizes.sm};
              min-height: 32px;
            `
          : size === 'large'
            ? css`
                padding: ${theme.spacing.sm} ${theme.spacing.xl};
                font-size: ${theme.fontSizes.lg};
                min-height: 48px;
              `
            : css`
                padding: ${theme.spacing.sm} ${theme.spacing.lg};
                font-size: ${theme.fontSizes.base};
                min-height: 38px;
              `}
        &:hover:not(:disabled) {
          background: ${theme.colors.primary};
          color: ${theme.colors.white};
          border-color: ${theme.colors.primary};
          transform: none;
          box-shadow: none;
        }
        &:focus-visible {
          box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.25);
        }
      `;
    }

    if (variant === 'pagination') {
      return css`
        justify-content: center;
        padding: 2px ${theme.spacing.sm};
        min-width: 30px;
        min-height: 30px;
        font-size: ${theme.fontSizes.sm};
        font-weight: ${pageActive ? theme.fontWeights.medium : theme.fontWeights.normal};
        border-width: 1px;
        border-color: ${theme.colors.border};
        border-radius: ${theme.borderRadius.sm};
        background: ${pageActive ? theme.colors.primary : theme.colors.surface};
        color: ${pageActive ? theme.colors.white : theme.colors.secondary};
        box-shadow: none;
        &:hover:not(:disabled) {
          background: ${pageActive
            ? theme.colors.primary
            : theme.colors.background};
          border-color: ${pageActive ? theme.colors.primary : theme.colors.border};
          color: ${pageActive ? theme.colors.white : theme.colors.primary};
          transform: none;
          box-shadow: none;
        }
        &:focus-visible {
          box-shadow: 0 0 0 2px rgba(0, 113, 227, 0.3);
        }
      `;
    }

    switch (size) {
      case 'small':
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.md};
          font-size: ${theme.fontSizes.sm};
          min-height: 32px;
        `;
      case 'large':
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.xl};
          font-size: ${theme.fontSizes.lg};
          min-height: 48px;
        `;
      default:
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          font-size: ${theme.fontSizes.base};
          min-height: 38px;
        `;
    }
  }}

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
          border-width: 2px;
          border-color: ${theme.colors.blue[500]};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.blue[500]};
            color: ${theme.colors.white};
          }
        `;
      case 'ghost':
      case 'muted':
      case 'pagination':
        return css``;
      default:
        return css`
          background-color: ${theme.colors.blue[500]};
          color: ${theme.colors.white};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.blue[600]};
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
        `;
    }
  }}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    `}

  &:focus-visible {
    ${({ variant }) =>
      variant !== 'ghost' &&
      variant !== 'pagination' &&
      variant !== 'muted' &&
      css`
        box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.35);
      `}
  }
`;
