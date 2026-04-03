import { keyframes } from "styled-components"

/* ─── Homepage “extreme” motion (opt-in via styled-components; respect reduced-motion in CSS) ─── */

/** Homepage module bands — fade up without overshoot */
export const homeModuleSlamIn = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`

/** Hero headline gradient drift */
export const heroTitleFlow = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
`

/** Eyebrow / label breathing */
export const heroEyebrowPulse = keyframes`
  0%,
  100% {
    letter-spacing: 0.08em;
    opacity: 0.92;
  }
  50% {
    letter-spacing: 0.16em;
    opacity: 1;
  }
`

/** Floating orbs behind hero */
export const heroOrbDrift = keyframes`
  0%,
  100% {
    transform: translate(-50%, -50%) translate3d(0, 0, 0) scale(1);
  }
  28% {
    transform: translate(-50%, -50%) translate3d(12%, -10%, 0) scale(1.12);
  }
  55% {
    transform: translate(-50%, -50%) translate3d(-14%, 12%, 0) scale(0.92);
  }
  78% {
    transform: translate(-50%, -50%) translate3d(6%, 8%, 0) scale(1.06);
  }
`

/** Link underline energy */
export const linkShimmer = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
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
