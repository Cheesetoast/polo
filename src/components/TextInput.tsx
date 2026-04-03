import { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { rgba, theme } from '../styles/theme';

export type TextInputWidth = 'full' | 'flex';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** `full` = block width; `flex` = grow in a flex row (e.g. homepage search). */
  inputWidth?: TextInputWidth;
  /** Extra space below the field (filter stacks). */
  marginBottom?: keyof typeof theme.spacing | false;
}

const StyledTextInput = styled.input.withConfig({
  shouldForwardProp: (prop) => !['$inputWidth', '$marginBottom'].includes(prop),
})<{
  $inputWidth: TextInputWidth;
  $marginBottom: keyof typeof theme.spacing | false;
}>`
  box-sizing: border-box;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  min-height: 38px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fontFamily};
  background: ${theme.colors.surface};
  color: ${theme.colors.primary};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  ${({ $inputWidth }) =>
    $inputWidth === 'flex'
      ? css`
          flex: 1;
          min-width: 0;
        `
      : css`
          width: 100%;
        `}

  ${({ $marginBottom }) =>
    $marginBottom &&
    css`
      margin-bottom: ${theme.spacing[$marginBottom]};
    `}

  &:focus {
    outline: none;
    border-color: ${theme.colors.blue[500]};
    box-shadow: 0 0 0 3px ${rgba.indigo(0.2)};
  }

  &::placeholder {
    color: ${theme.colors.muted};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ inputWidth = 'full', marginBottom = false, ...rest }, ref) => (
    <StyledTextInput
      ref={ref}
      $inputWidth={inputWidth}
      $marginBottom={marginBottom}
      {...rest}
    />
  )
);

TextInput.displayName = 'TextInput';

export default TextInput;
