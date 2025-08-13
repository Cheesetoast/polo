// Design system tokens
export const theme = {
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
    '2xl': 1.5,
    '3xl': 1.4,
    '4xl': 1.3,
    '5xl': 1.2,
  },
  
  // Colors
  colors: {
    primary: '#111827',
    secondary: '#6b7280',
    muted: '#9ca3af',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    // Button colors
    blue: {
      500: '#3b82f6',
      600: '#2563eb',
    },
    gray: {
      600: '#4b5563',
    },
    white: '#ffffff',
  },
  
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  
  // Border radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
} as const;

// Type helpers
export type FontSize = keyof typeof theme.fontSizes;
export type FontWeight = keyof typeof theme.fontWeights;
export type Color = keyof typeof theme.colors;
