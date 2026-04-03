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
      background-color: ${rgba.indigo(0.06)};
      background-image:
        radial-gradient(
          ellipse 115% 82% at 22% -14%,
          rgba(255, 255, 255, 0.58) 0%,
          transparent 54%
        ),
        linear-gradient(
          158deg,
          ${rgba.indigo(0.1)} 0%,
          ${rgba.indigo(0.022)} 100%
        );
      border: 1px solid ${rgba.indigo(0.15)};
      border-radius: ${radius};
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.42),
        inset 0 -1px 0 ${rgba.indigo(0.06)},
        0 1px 4px rgba(15, 23, 42, 0.06);
    `
  }

  return css`
    background-color: rgba(255, 255, 255, 0.4);
    background-image:
      radial-gradient(
        ellipse 108% 74% at 50% -12%,
        rgba(255, 255, 255, 0.58) 0%,
        transparent 52%
      ),
      linear-gradient(
        170deg,
        rgba(255, 255, 255, 0.92) 0%,
        rgba(241, 245, 249, 0.48) 100%
      );
    border: 1px solid rgba(226, 232, 240, 0.9);
    border-radius: ${radius};
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.78),
      inset 0 -1px 0 rgba(15, 23, 42, 0.032),
      0 1px 3px rgba(15, 23, 42, 0.045);
  `
}

/** Top rim + contact edge — reads as a physical layer above the mesh */
const rimAndLift =
  "inset 0 1px 0 rgba(255, 255, 255, 0.88), 0 1px 0 rgba(15, 23, 42, 0.05)"

/** Full-width page canvas — mesh + light vignette for spatial depth */
export const mainBackdrop = css`
  position: relative;
  isolation: isolate;
  background-color: ${theme.colors.background};
  background-image:
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.03) 0%,
      transparent 14%,
      transparent 82%,
      rgba(0, 0, 0, 0.02) 100%
    ),
    radial-gradient(ellipse 120% 80% at 50% -28%, ${rgba.indigo(0.12)}, transparent 50%),
    radial-gradient(ellipse 88% 52% at 100% 12%, ${rgba.indigo(0.06)}, transparent 46%),
    radial-gradient(ellipse 72% 48% at -4% 48%, ${rgba.indigo(0.05)}, transparent 42%),
    radial-gradient(ellipse 92% 58% at 100% 98%, ${rgba.indigo(0.06)}, transparent 40%),
    radial-gradient(ellipse 125% 70% at 50% 102%, rgba(0, 0, 0, 0.03), transparent 48%);
  background-attachment: scroll;
`

/** Primary content blocks — soft light falloff + faint cool floor for depth */
export const sectionSurfaceProminent = css`
  background-color: ${theme.colors.surface};
  background-image:
    radial-gradient(
      ellipse 110% 80% at 12% -8%,
      rgba(255, 255, 255, 0.88) 0%,
      transparent 52%
    ),
    radial-gradient(
      ellipse 88% 68% at 0% 100%,
      ${rgba.indigo(0.04)} 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse 90% 70% at 100% 100%,
      ${rgba.indigo(0.05)} 0%,
      transparent 55%
    ),
    linear-gradient(
      168deg,
      ${theme.colors.surface} 0%,
      rgba(250, 250, 252, 0.98) 50%,
      rgba(248, 248, 250, 0.96) 100%
    );
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  box-shadow:
    ${rimAndLift},
    ${theme.shadows.sm},
    0 4px 16px rgba(0, 0, 0, 0.05),
    0 26px 56px -30px rgba(0, 0, 0, 0.08);
`

/** Alternate sections — light frosted slate, same depth language as prominent */
export const sectionSurfaceSoft = css`
  background-color: rgba(255, 255, 255, 0.78);
  background-image:
    radial-gradient(
      ellipse 105% 75% at 10% -6%,
      rgba(255, 255, 255, 0.55) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse 85% 65% at 100% 100%,
      ${rgba.indigo(0.03)} 0%,
      transparent 52%
    ),
    linear-gradient(
      158deg,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(245, 245, 247, 0.55) 42%,
      rgba(241, 241, 243, 0.62) 100%
    );
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  box-shadow:
    ${rimAndLift},
    ${theme.shadows.sm},
    0 3px 14px rgba(0, 0, 0, 0.04),
    0 20px 44px -32px rgba(0, 0, 0, 0.08);
  @supports (backdrop-filter: blur(10px)) {
    backdrop-filter: blur(10px);
  }
`

/** Search / filter panels */
export const panelElevated = css`
  background: linear-gradient(
    160deg,
    ${theme.colors.surface} 0%,
    rgba(248, 250, 255, 0.96) 100%
  );
  border: 1px solid ${rgba.indigo(0.1)};
  border-radius: ${theme.borderRadius.lg};
  box-shadow:
    ${rimAndLift},
    0 2px 6px rgba(0, 0, 0, 0.04),
    0 8px 22px rgba(15, 23, 42, 0.05),
    0 16px 40px -26px ${rgba.indigo(0.13)};
`

/** Results page filter strip */
export const panelSearchStrip = css`
  background: linear-gradient(
    155deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(241, 245, 254, 0.85) 100%
  );
  border: 1px solid ${rgba.indigo(0.1)};
  border-radius: ${theme.borderRadius.lg};
  box-shadow:
    ${rimAndLift},
    ${theme.shadows.sm},
    0 12px 32px -22px ${rgba.indigo(0.12)};
`

/** Authors / genres filter wells */
export const panelFilters = css`
  background: linear-gradient(
    165deg,
    rgba(249, 250, 251, 0.98) 0%,
    rgba(241, 245, 249, 0.92) 55%,
    rgba(238, 242, 255, 0.42) 100%
  );
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 12px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 1px 0 rgba(15, 23, 42, 0.04),
    0 2px 10px rgba(15, 23, 42, 0.05);
`

/** Compact inset — same language as homepage shelf stat tiles */
export const statTile = moduleInsetSurface({ tone: "neutral", size: "tile" })

/** Same surface as homepage modules — keeps dashboard aligned with {@link sectionSurfaceProminent}. */
export const dashboardShell = sectionSurfaceProminent

export const dashboardStatCard = css`
  background: linear-gradient(
    155deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(241, 245, 249, 0.72) 100%
  );
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: ${theme.borderRadius.lg};
  box-shadow:
    ${rimAndLift},
    0 2px 6px rgba(15, 23, 42, 0.05);
`

export const dashboardDetailPanel = moduleInsetSurface({
  tone: "neutral",
  size: "well",
})

/** Empty / management callouts */
export const panelMuted = css`
  background: linear-gradient(
    160deg,
    rgba(249, 250, 251, 0.96) 0%,
    rgba(241, 245, 249, 0.82) 100%
  );
  border: 1px solid rgba(203, 213, 225, 0.55);
  border-radius: ${theme.borderRadius.lg};
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 1px 2px rgba(15, 23, 42, 0.04);
`

/** Book detail page shell */
export const bookPageShell = css`
  padding: ${theme.spacing.lg};
  background: linear-gradient(
    165deg,
    rgba(255, 255, 255, 0.99) 0%,
    rgba(248, 250, 255, 0.94) 100%
  );
  border: 1px solid ${rgba.indigo(0.1)};
  border-radius: ${theme.borderRadius.xl};
  box-shadow:
    ${rimAndLift},
    ${theme.shadows.md},
    0 6px 20px rgba(15, 23, 42, 0.05),
    0 28px 64px -32px ${rgba.indigo(0.13)};
`

/** Style guide intro + section blocks */
export const styleguideIntro = css`
  background: linear-gradient(
    155deg,
    rgba(255, 255, 255, 0.99) 0%,
    rgba(241, 245, 254, 0.72) 100%
  );
  border: 1px solid ${rgba.indigo(0.11)};
  border-radius: ${theme.borderRadius.xl};
  box-shadow:
    ${rimAndLift},
    0 4px 14px rgba(15, 23, 42, 0.05),
    0 14px 40px -22px ${rgba.indigo(0.14)};
`

export const styleguideSection = css`
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  background: linear-gradient(
    175deg,
    rgba(255, 255, 255, 0.78) 0%,
    rgba(248, 250, 252, 0.55) 100%
  );
  border: 1px solid rgba(226, 232, 240, 0.85);
  box-shadow:
    ${rimAndLift},
    0 2px 6px rgba(15, 23, 42, 0.04);
`

/** Simple project / text intro card */
export const projectIntroCard = css`
  padding: ${theme.spacing["2xl"]};
  margin-top: ${theme.spacing.md};
  background: linear-gradient(
    155deg,
    rgba(255, 255, 255, 0.97) 0%,
    rgba(241, 245, 254, 0.65) 100%
  );
  border: 1px solid ${rgba.indigo(0.12)};
  border-radius: ${theme.borderRadius.xl};
  box-shadow:
    ${rimAndLift},
    0 4px 14px rgba(15, 23, 42, 0.05),
    0 18px 44px -24px ${rgba.indigo(0.16)};
`
