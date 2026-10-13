/** Accent tints for borders, glows, and glass (dashboard gold). */
export const rgba = {
  indigo: (a: number) => `rgba(245, 192, 66, ${a})`,
  coral: (a: number) => `rgba(232, 90, 79, ${a})`,
} as const;

// Design system tokens — dark reading dashboard
export const theme = {
  fontFamily: `'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif`,

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

  // Colors — warm dark surfaces + gold accent
  colors: {
    primary: '#f7f1ec',
    secondary: '#9a8f8a',
    muted: '#7a706c',
    background: '#1a1210',
    surface: '#241c1a',
    border: 'rgba(255, 255, 255, 0.1)',
    success: '#34c759',
    error: '#e85a4f',
    warning: '#f5c042',
    /** Dark ink for text on gold / light controls */
    ink: '#1a1210',
    accent: '#f5c042',
    coral: '#e85a4f',
    blue: {
      500: '#f5c042',
      600: '#e0ab30',
      700: '#c99520',
    },
    gray: {
      600: '#7a706c',
    },
    white: '#ffffff',
  },

  // Elevation
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.25)',
    md: '0 4px 12px rgba(0, 0, 0, 0.28), 0 2px 4px rgba(0, 0, 0, 0.2)',
    lg: '0 12px 40px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.22)',
    nav: '0 1px 0 rgba(255, 255, 255, 0.06), 0 4px 24px rgba(0, 0, 0, 0.25)',
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

  // Border radius — soft dashboard cards
  borderRadius: {
    sm: '8px',
    md: '14px',
    lg: '20px',
    xl: '28px',
    full: '9999px',
  },
} as const;

// Type helpers
export type FontSize = keyof typeof theme.fontSizes;
export type FontWeight = keyof typeof theme.fontWeights;
export type Color = keyof typeof theme.colors;
