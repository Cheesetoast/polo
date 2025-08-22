import React from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';

interface GenreLinkProps {
  genre: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

export const GenreLink = ({ 
  genre, 
  children, 
  className, 
  style,
  onClick 
}: GenreLinkProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
      return;
    }
    
    // Default navigation to genre page
    navigate(`/genre/${encodeURIComponent(genre)}`);
  };

  return (
    <StyledGenreLink 
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </StyledGenreLink>
  );
};

const StyledGenreLink = styled.span`
  background: #111827;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #374151;
  }
`;
