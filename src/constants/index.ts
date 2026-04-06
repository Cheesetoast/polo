import { ReadingStatus } from '../types/reading';

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

// Modal Configuration
export const MODAL_CONFIG = {
  ENABLE_MODAL_DISMISS: true, // Set to false to disable localStorage and show modal every time
} as const;

/** Toggle homepage bar-chart panels (Insights genre mix, Bookshelf rating spread). */
export const HOMEPAGE_VIZ = {
  SHOW_GENRE_MIX: false,
  SHOW_RATING_SPREAD: false,
} as const;

// Default Values
export const DEFAULTS = {
  FALLBACK_TITLE: SITE_CONFIG.SITE_NAME,
  FALLBACK_IMAGE_ALT: 'Image',
  FALLBACK_BOOK_COVER: 'Book cover',
  DEFAULT_BOOK_STATUS: null as ReadingStatus | null,
} as const;
