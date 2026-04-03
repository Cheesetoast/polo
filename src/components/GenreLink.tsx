import React from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import { theme } from '../styles/theme';

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
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${theme.colors.gray[600]};
    transform: translateY(-1px);
  }
`;
