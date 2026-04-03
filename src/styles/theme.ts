/** Brand blue tints for borders, glows, and glass (Apple-style accent). */
export const rgba = {
  indigo: (a: number) => `rgba(0, 113, 227, ${a})`,
} as const;

// Design system tokens — neutral surfaces + crisp accent blue
export const theme = {
  fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,

  // Typography
  fontSizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '56px',
  },

  // Font weights
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeights: {
    xs: 1.4,
    sm: 1.5,
    base: 1.5,
    lg: 1.6,
    xl: 1.6,
    '2xl': 1.45,
    '3xl': 1.35,
    '4xl': 1.2,
    '5xl': 1.08,
    '6xl': 1.05,
  },

  // Colors — text / UI neutrals + single accent blue
  colors: {
    primary: '#1d1d1f',
    secondary: '#6e6e73',
    muted: '#aeaeb2',
    background: '#f5f5f7',
    surface: '#ffffff',
    border: '#d2d2d7',
    success: '#34c759',
    error: '#ff3b30',
    warning: '#ff9500',
    blue: {
      500: '#0071e3',
      600: '#0077ed',
      700: '#0066cc',
    },
    gray: {
      600: '#6e6e73',
    },
    white: '#ffffff',
  },

  // Elevation (soft, diffuse — not heavy Material shadows)
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.08)',
    md: '0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04)',
    lg: '0 12px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
    nav: '0 1px 0 rgba(0, 0, 0, 0.06), 0 4px 24px rgba(0, 0, 0, 0.04)',
  },

  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  // Border radius — slightly rounder for a current UI feel
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    full: '9999px',
  },
} as const;

// Type helpers
export type FontSize = keyof typeof theme.fontSizes;
export type FontWeight = keyof typeof theme.fontWeights;
export type Color = keyof typeof theme.colors;
