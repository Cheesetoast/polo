import type { ReactNode } from "react"
import styled, { css } from "styled-components"
import { theme } from "../styles/theme"
import { sectionSurfaceProminent, sectionSurfaceSoft } from "../styles/surfaceStyles"

export type HomepageSectionVariant = "prominent" | "soft"

export interface HomepageSectionProps {
  variant: HomepageSectionVariant
  /** Omit outer vertical margins; parent supplies gap (e.g. homepage module grid). */
  inModuleGrid?: boolean
  /** Tighter padding inside the card (e.g. bookshelf band with lots of internal structure). */
  dense?: boolean
  children: ReactNode
  className?: string
}

/**
 * Shared shell for homepage bands below the hero (surface, spacing, rhythm).
 * `prominent` = homepage modules (shared card surface). `soft` = alternate pages (e.g. bookshelf band).
 *
 * Heading pattern inside each module: one `Eyebrow` (label) + one `Text variant="h2"` title.
 * Subsections under that title use `h3` (e.g. dashboard insets, bookshelf aside).
 *
 * Spacing rhythm: `theme.spacing.lg` below the module `h2`; `theme.spacing.md` between stacked
 * body blocks (form → link, stat grid → link → copy); `well` inset panels use `padding: lg`.
 */
export function HomepageSection({
  variant,
  inModuleGrid = false,
  dense = false,
  children,
  className,
}: HomepageSectionProps) {
  return (
    <Root
      $variant={variant}
      $inModuleGrid={inModuleGrid}
      $dense={dense}
      className={className}
    >
      {children}
    </Root>
  )
}

const Root = styled.section<{
  $variant: HomepageSectionVariant
  $inModuleGrid: boolean
  $dense: boolean
}>`
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;

  ${({ $variant }) =>
    $variant === "prominent" ? sectionSurfaceProminent : sectionSurfaceSoft}

  ${({ $variant, $inModuleGrid, $dense }) =>
    $inModuleGrid
      ? css`
          position: relative;
          z-index: ${$variant === "prominent" ? 1 : "auto"};
          margin: 0;
          padding: ${$dense
            ? `${theme.spacing.md} ${theme.spacing.sm}`
            : `${theme.spacing.lg} ${theme.spacing.md}`};

          @media (min-width: 768px) {
            padding: ${$dense
              ? `${theme.spacing.lg} ${theme.spacing.md}`
              : `${theme.spacing.xl} ${theme.spacing.lg}`};
          }
        `
      : $variant === "prominent"
        ? css`
            position: relative;
            z-index: 1;
            margin: ${theme.spacing.lg} 0 ${theme.spacing.xl};
            padding: ${theme.spacing.lg} ${theme.spacing.md};

            @media (min-width: 768px) {
              margin-top: ${theme.spacing.xl};
              padding: ${theme.spacing.xl} ${theme.spacing.lg};
            }
          `
        : css`
            margin: ${theme.spacing.xl} 0;
            padding: ${theme.spacing.lg} ${theme.spacing.md};

            @media (min-width: 768px) {
              padding: ${theme.spacing.xl} ${theme.spacing.lg};
            }
          `}
`
