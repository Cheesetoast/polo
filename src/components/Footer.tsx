import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { Text } from './Text';
import { footerWashDrift } from '../styles/motion';
import { rgba, theme } from '../styles/theme';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle variant="h4">
            About Book Stack
          </FooterTitle>
          <FooterText variant="p">
            A personal book collection and reading tracker. Discover new books, 
            track your reading progress, and organize your literary journey.
          </FooterText>
        </FooterSection>

        <FooterSection>
          <FooterTitle variant="h4">
            Quick Links
          </FooterTitle>
          <FooterLink to="/">
            Home
          </FooterLink>
          <FooterLink to="/search">
            Search Books
          </FooterLink>
          <FooterLink to="/bookshelf">
            Bookshelf
          </FooterLink>
          <FooterLink to="/project">
            About
          </FooterLink>
          <FooterLink to="/styleguide">
            Styleguide
          </FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle variant="h4">
            Resources
          </FooterTitle>
          <FooterLink to="/search-results">
            Browse All Books
          </FooterLink>
          <FooterLink to="/bookshelf">
            Reading Lists
          </FooterLink>
          <FooterExternalLink 
            href="https://openlibrary.org" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Open Library
          </FooterExternalLink>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <Text variant="caption">
          © {currentYear} Polo Book Collection. Built with Gatsby and ❤️
        </Text>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;

// Styled Components
const FooterContainer = styled.footer`
  flex-shrink: 0;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background-color: ${theme.colors.surface};
  background-image: linear-gradient(
    105deg,
    ${rgba.indigo(0.04)} 0%,
    transparent 30%,
    rgba(0, 0, 0, 0.02) 52%,
    transparent 72%,
    ${rgba.indigo(0.035)} 100%
  );
  background-size: 240% 100%;
  background-position: 0% 50%;
  animation: ${footerWashDrift} 48s ease-in-out infinite alternate;
  color: ${theme.colors.primary};
  border-top: 1px solid ${theme.colors.border};
  padding: ${theme.spacing['2xl']} 0 ${theme.spacing.xl};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background-size: 100% 100%;
    background-position: 50% 50%;
  }
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled(Text)`
  color: ${theme.colors.primary};
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
`;

const FooterText = styled(Text)`
  line-height: 1.6;
  color: ${theme.colors.secondary};
`;

const FooterLink = styled(Link)`
  color: ${theme.colors.secondary};
  text-decoration: none;
  font-size: ${theme.fontSizes.sm};
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.blue[600]};
  }
`;

const FooterExternalLink = styled.a`
  color: ${theme.colors.secondary};
  text-decoration: none;
  font-size: ${theme.fontSizes.sm};
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.blue[600]};
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
  color: ${theme.colors.muted};
`;
