import styled, { css } from "styled-components"
import { theme } from "../styles/theme"
import {
  moduleInsetSurface,
  type ModuleInsetSize,
  type ModuleInsetTone,
} from "../styles/surfaceStyles"

/**
 * Standard inset surface for nested panels inside homepage modules and the dashboard
 * (subtle depth on top of the module shell).
 *
 * Default padding matches module shells: `md` horizontal on small screens, `lg` from 768px
 * for wells; tiles use `md` on all breakpoints. Override only when a layout needs extra space.
 *
 */
export const ModuleInsetPanel = styled.div<{
  $tone?: ModuleInsetTone
  $size?: ModuleInsetSize
}>`
  box-sizing: border-box;
  min-width: 0;

  ${({ $tone = "neutral", $size = "well" }) =>
    moduleInsetSurface({ tone: $tone, size: $size })}

  ${({ $size = "well" }) =>
    $size === "well"
      ? css`
          padding: ${theme.spacing.md};

          @media (min-width: 768px) {
            padding: ${theme.spacing.lg};
          }
        `
      : css`
          padding: ${theme.spacing.md};
        `}
`

export type { ModuleInsetSize, ModuleInsetTone }
