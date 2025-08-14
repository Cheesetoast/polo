export const SITE_CONFIG = {
  SITE_NAME: 'Book Stack'
} as const;


// Contentful Content Types
export const CONTENTFUL_CONTENT_TYPES = {
  HOMEPAGE: 'homepage',
  BOOK: 'book',
} as const;

// Gatsby Image Settings
export const IMAGE_SETTINGS = {
  LAYOUT: 'CONSTRAINED' as const,
  PLACEHOLDER: 'BLURRED' as const,
  WIDTH: 300,
  QUALITY: 90,
} as const;

// Development Settings
export const DEV_SETTINGS = {
  PORT: 8000,
  GRAPHQL_ENDPOINT: '/___graphql',
} as const;

// Default Values
export const DEFAULTS = {
  FALLBACK_TITLE: SITE_CONFIG.SITE_NAME,
  FALLBACK_IMAGE_ALT: 'Image',
  FALLBACK_BOOK_COVER: 'Book cover',
} as const;
