import React from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';

interface BookLinkProps {
  isbn: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const BookLink = ({ isbn, children, className, style }: BookLinkProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Remove dashes from ISBN for consistent URL formatting
    const cleanIsbn = isbn.replace(/-/g, '');
    navigate(`/book/${cleanIsbn}`);
  };

  return (
    <StyledBookLink 
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </StyledBookLink>
  );
};

const StyledBookLink = styled.span`
  color: #007bff;
  font-size: 0.9rem;
  margin-right: 8px;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;

  &:hover {
    color: #0056b3;
  }

  &:active {
    color: #004085;
  }
`;
