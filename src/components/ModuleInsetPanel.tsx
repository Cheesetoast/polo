import styled from "styled-components"
import {
  moduleInsetSurface,
  type ModuleInsetSize,
  type ModuleInsetTone,
} from "../styles/surfaceStyles"

/**
 * Standard inset surface for nested panels inside homepage modules and the dashboard
 * (subtle depth on top of the module shell).
 *
 * @example
 * styled(ModuleInsetPanel).attrs({ $tone: 'accent', $size: 'well' })` padding: …; `
 */
export const ModuleInsetPanel = styled.div<{
  $tone?: ModuleInsetTone
  $size?: ModuleInsetSize
}>`
  box-sizing: border-box;
  min-width: 0;

  ${({ $tone = "neutral", $size = "well" }) =>
    moduleInsetSurface({ tone: $tone, size: $size })}
`

export type { ModuleInsetSize, ModuleInsetTone }
