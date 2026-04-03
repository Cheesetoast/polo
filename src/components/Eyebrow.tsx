import { type ReactNode } from "react"
import styled, { css } from "styled-components"
import { theme } from "../styles/theme"

export type EyebrowVariant = "accent" | "neutral"

export interface EyebrowProps {
  children: ReactNode
  /** `accent`: hero / emphasis (brand blue). `neutral`: section labels (muted). */
  variant?: EyebrowVariant
  align?: "left" | "center" | "right"
  className?: string
}

/** Uppercase marketing label. Same tokens as the homepage. Use under section titles or above heroes. */
export const Eyebrow = ({
  children,
  variant = "neutral",
  align = "left",
  className,
}: EyebrowProps) => (
  <StyledEyebrow $variant={variant} $align={align} className={className}>
    {children}
  </StyledEyebrow>
)

const StyledEyebrow = styled.p<{
  $variant: EyebrowVariant
  $align: "left" | "center" | "right"
}>`
  margin: 0;
  font-weight: ${theme.fontWeights.semibold};
  text-transform: uppercase;

  ${({ $align }) => css`
    text-align: ${$align};
  `}

  ${({ $variant }) =>
    $variant === "accent"
      ? css`
          font-size: ${theme.fontSizes.sm};
          letter-spacing: 0.08em;
          color: ${theme.colors.blue[600]};
          margin-bottom: ${theme.spacing.md};
        `
      : css`
          font-size: ${theme.fontSizes.xs};
          letter-spacing: 0.12em;
          color: ${theme.colors.secondary};
          margin-bottom: ${theme.spacing.sm};
        `}
`
