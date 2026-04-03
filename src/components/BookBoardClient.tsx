import { BookBoardStatic } from './BookBoardStatic';

/**
 * Bookshelf board: {@link BookBoardStatic} only (no @dnd-kit). Drag-and-drop uses
 * native HTML5 DnD so Gatsby SSR/hydration never loads `DndContext`.
 */
export const BookBoardClient = BookBoardStatic;
