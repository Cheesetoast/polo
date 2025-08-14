import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Book, BookData } from './Book';

export interface BooksContainerProps {
    books: BookData[];
}

const StyledBooksContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: ${theme.spacing.md};
    margin-top: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
`;

export const BooksContainer: React.FC<BooksContainerProps> = ({ books }) => {
    return (
        <StyledBooksContainer>
            {books.map((book) => (
                <Book book={book} key={book.isbn} />
            ))}
        </StyledBooksContainer>
    );
};

export default BooksContainer;
