import { css } from "styled-components"
import { rgba, theme } from "./theme"

export type ModuleInsetTone = "neutral" | "accent"
export type ModuleInsetSize = "well" | "tile"

/**
 * Inset panels inside module shells (search stat, shelf tiles, asides, dashboard cells).
 * Neutral = recessed slate/white wash; accent = soft indigo wash for emphasis.
 */
export function moduleInsetSurface(opts: {
  tone: ModuleInsetTone
  size: ModuleInsetSize
}) {
  const radius =
    opts.size === "well" ? theme.borderRadius.lg : theme.borderRadius.md

  if (opts.tone === "accent") {
    return css`
      background-color: ${rgba.indigo(0.12)};
      background-image: linear-gradient(
        158deg,
        ${rgba.indigo(0.16)} 0%,
        ${rgba.indigo(0.05)} 100%
      );
      border: 1px solid ${rgba.indigo(0.28)};
      border-radius: ${radius};
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 4px 12px rgba(0, 0, 0, 0.2);
    `
  }

  return css`
    background-color: rgba(255, 255, 255, 0.04);
    background-image: linear-gradient(
      170deg,
      rgba(255, 255, 255, 0.06) 0%,
      rgba(255, 255, 255, 0.02) 100%
    );
    border: 1px solid ${theme.colors.border};
    border-radius: ${radius};
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      0 4px 14px rgba(0, 0, 0, 0.2);
  `
}

/** Top rim + contact edge — reads as a physical layer above the mesh */
const rimAndLift =
  "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 1px 0 rgba(0, 0, 0, 0.25)"

/**
 * Full-width page canvas — same mesh + sheen as the homepage hero, static (no motion).
 * Pseudo-layers sit behind direct children so page content stays above the wash.
 */
export const mainBackdrop = css`
  position: relative;
  isolation: isolate;
  background-color: ${theme.colors.background};

  &::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 150%;
    height: 150%;
    transform: translate(-50%, -50%);
    transform-origin: center center;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(
        ellipse 58% 52% at 50% 44%,
        ${rgba.indigo(0.14)} 0%,
        transparent 58%
      ),
      radial-gradient(
        ellipse 42% 40% at 72% 38%,
        ${rgba.indigo(0.08)} 0%,
        transparent 55%
      ),
      radial-gradient(
        ellipse 48% 44% at 18% 62%,
        ${rgba.indigo(0.06)} 0%,
        transparent 52%
      ),
      radial-gradient(
        ellipse 50% 46% at 50% 56%,
        rgba(0, 0, 0, 0.05) 0%,
        transparent 54%
      );
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: linear-gradient(
      100deg,
      transparent 0%,
      ${rgba.indigo(0.02)} 18%,
      ${rgba.indigo(0.14)} 48%,
      rgba(255, 255, 255, 0.35) 52%,
      ${rgba.indigo(0.12)} 58%,
      transparent 82%,
      transparent 100%
    );
    background-size: 100% 100%;
    background-position: center;
    opacity: 0.85;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      opacity: 0.5;
    }

    &::after {
      opacity: 0.4;
    }
  }

  /* Flex/grid: z-index on flex children stacks above pseudo-layers; avoid forcing position on page roots. */
  & > * {
    z-index: 1;
  }
`

/** Primary content blocks — elevated dark cards */
export const sectionSurfaceProminent = css`
  background-color: ${theme.colors.surface};
  background-image: linear-gradient(
    168deg,
    rgba(255, 255, 255, 0.05) 0%,
    ${theme.colors.surface} 45%,
    #1f1715 100%
  );
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  box-shadow:
    ${rimAndLift},
    ${theme.shadows.sm},
    0 4px 20px rgba(0, 0, 0, 0.25),
    0 28px 60px -28px rgba(0, 0, 0, 0.4);
`

/** Alternate sections — slightly softer dark panel */
export const sectionSurfaceSoft = css`
  background-color: rgba(255, 255, 255, 0.03);
  background-image: linear-gradient(
    158deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  box-shadow:
    ${rimAndLift},
    ${theme.shadows.sm},
    0 3px 14px rgba(0, 0, 0, 0.2);
  @supports (backdrop-filter: blur(10px)) {
    backdrop-filter: blur(10px);
  }
`

/** Search / filter panels */
export const panelElevated = css`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow:
    ${rimAndLift},
    0 8px 22px rgba(0, 0, 0, 0.22);
`

/** Results page filter strip */
export const panelSearchStrip = css`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow:
    ${rimAndLift},
    ${theme.shadows.sm};
`

/** Authors / genres filter wells */
export const panelFilters = css`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 2px 10px rgba(0, 0, 0, 0.2);
`

/** Compact inset — same language as homepage shelf stat tiles */
export const statTile = moduleInsetSurface({ tone: "neutral", size: "tile" })

/** Same surface as homepage modules — keeps dashboard aligned with {@link sectionSurfaceProminent}. */
export const dashboardShell = sectionSurfaceProminent

export const dashboardStatCard = css`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow:
    ${rimAndLift},
    0 2px 6px rgba(0, 0, 0, 0.2);
`

export const dashboardDetailPanel = moduleInsetSurface({
  tone: "neutral",
  size: "well",
})

/** Empty / management callouts */
export const panelMuted = css`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow:
    ${rimAndLift},
    0 2px 8px rgba(0, 0, 0, 0.18);
`

/** Book detail page shell */
export const bookPageShell = css`
  padding: ${theme.spacing.lg};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  box-shadow:
    ${rimAndLift},
    ${theme.shadows.md},
    0 16px 40px rgba(0, 0, 0, 0.28);
`

/** Style guide intro + section blocks */
export const styleguideIntro = css`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  box-shadow:
    ${rimAndLift},
    0 8px 24px rgba(0, 0, 0, 0.22);
`

export const styleguideSection = css`
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${theme.colors.border};
  box-shadow:
    ${rimAndLift},
    0 4px 16px rgba(0, 0, 0, 0.18);
`

/** Simple project / text intro card */
export const projectIntroCard = css`
  padding: ${theme.spacing["2xl"]};
  margin-top: ${theme.spacing.md};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  box-shadow:
    ${rimAndLift},
    0 8px 24px rgba(0, 0, 0, 0.22);
`

/**
 * Native OS select arrows ignore padding-right. Reset appearance and draw a
 * chevron inset from the right edge so right spacing is controllable.
 */
const SELECT_CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%239a8f8a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`

export const nativeSelectChevron = css`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: ${SELECT_CHEVRON_SVG};
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px 12px;
  padding-right: 2.25rem;
`
