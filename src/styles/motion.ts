import { keyframes } from "styled-components"

/**
 * Multi-layer radial sheen on main canvas (`Layout` `MainContent::before`).
 * Three comma-separated positions track the three background images.
 */
export const mainCanvasSheenDrift = keyframes`
  0% {
    background-position: 8% 24%, 92% 68%, 48% 88%;
  }
  50% {
    background-position: 22% 38%, 78% 52%, 58% 22%;
  }
  100% {
    background-position: 14% 18%, 88% 78%, 42% 72%;
  }
`

/** Footer band — soft horizontal drift of a tinted wash. */
export const footerWashDrift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
`
