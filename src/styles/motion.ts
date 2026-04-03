import { keyframes } from "styled-components"

/* ─── Homepage “extreme” motion (opt-in via styled-components; respect reduced-motion in CSS) ─── */

/** Big elastic entrance for homepage module bands */
export const homeModuleSlamIn = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, 80px, 0) scale(0.92) rotate(-0.6deg);
  }
  52% {
    opacity: 1;
    transform: translate3d(0, -14px, 0) scale(1.03) rotate(0.35deg);
  }
  76% {
    transform: translate3d(0, 8px, 0) scale(0.995) rotate(-0.08deg);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
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

/** Aggressive hero mesh blob */
export const heroMeshChaos = keyframes`
  0%,
  100% {
    transform: translate(-50%, -50%) rotate(0deg) scale(1);
    opacity: 0.5;
  }
  20% {
    transform: translate(-50%, -50%) rotate(2.5deg) scale(1.09);
    opacity: 0.72;
  }
  45% {
    transform: translate(-50%, -50%) rotate(-2deg) scale(1.14);
    opacity: 0.58;
  }
  70% {
    transform: translate(-50%, -50%) rotate(1.2deg) scale(1.04);
    opacity: 0.68;
  }
`

/** Fast sweeping sheen across hero */
export const heroSheenSweep = keyframes`
  0% {
    background-position: -30% 50%;
  }
  100% {
    background-position: 130% 50%;
  }
`

/** Catalog stat panel — lift + outer glow (inset shadows stay from ModuleInsetPanel) */
export const statBlockSurge = keyframes`
  0%,
  100% {
    transform: scale(1) translate3d(0, 0, 0);
    filter: drop-shadow(0 4px 12px rgba(0, 113, 227, 0.12));
  }
  50% {
    transform: scale(1.045) translate3d(0, -6px, 0);
    filter: drop-shadow(0 18px 36px rgba(0, 113, 227, 0.35));
  }
`

/** Big number heartbeat */
export const statNumberSurge = keyframes`
  0%,
  100% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.12);
  }
  55% {
    transform: scale(1.04);
  }
`

/** Idle wobble on shelf stat tiles */
export const shelfTileWobble = keyframes`
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(-0.4deg);
  }
  50% {
    transform: translate3d(0, -5px, 0) rotate(0.5deg);
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
