import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Book } from './Book';

export interface BooksContainerProps {
    books: Book[];
}

export const BooksContainer = ({ books }: BooksContainerProps) => {
    return (
        <StyledBooksContainer>
            {books.map((book) => (
                <Book book={book} key={book.isbn} />
            ))}
        </StyledBooksContainer>
    );
};

export default BooksContainer;

// Styled Components
const StyledBooksContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: ${theme.spacing.md};
    margin-top: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
`;
