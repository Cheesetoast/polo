import React from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';

interface AuthorLinkProps {
  authorName: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

export const AuthorLink = ({ 
  authorName, 
  children, 
  className, 
  style,
  onClick 
}: AuthorLinkProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
      return;
    }
    
    // Default navigation to search results filtered by author
    navigate(`/search-results?author=${encodeURIComponent(authorName)}`);
  };

  return (
    <StyledAuthorLink 
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </StyledAuthorLink>
  );
};

const StyledAuthorLink = styled.span`
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }

  &:active {
    color: #004085;
  }
`;
