/**
 * Shared Book type used by useBookStatus and other modules.
 * Defined here to avoid pulling in Book.tsx (and @dnd-kit) during SSR for pages that only need the type.
 */
export interface Book {
  title: string;
  author: string;
  description: {
    description: string;
  };
  image?: {
    gatsbyImageData: any;
    title?: string;
  } | null;
  isbn: string;
  communityRating?: number | null;
  userRating?: number | null;
  genres?: string[];
  progress?: number;
  pages?: number;
}
