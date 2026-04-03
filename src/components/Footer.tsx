import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { Text } from './Text';
import { theme } from '../styles/theme';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle variant="h4">
            About Polo
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
            My Bookshelf
          </FooterLink>
          <FooterLink to="/project">
            About
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
          <FooterExternalLink 
            href="https://goodreads.com" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Goodreads
          </FooterExternalLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle variant="h4">
            Connect
          </FooterTitle>
          <FooterText variant="p">Follow us for reading recommendations and updates.</FooterText>
          <SocialLinks>
            <SocialLink 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub"
            >
              📚
            </SocialLink>
            <SocialLink 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Twitter"
            >
              🐦
            </SocialLink>
            <SocialLink 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
            >
              📷
            </SocialLink>
          </SocialLinks>
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
  background-color: ${theme.colors.surface};
  color: ${theme.colors.primary};
  border-top: 1px solid ${theme.colors.border};
  padding: ${theme.spacing['2xl']} 0 ${theme.spacing.xl};
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
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
    color: ${theme.colors.blue[500]};
  }
`;

const FooterExternalLink = styled.a`
  color: ${theme.colors.secondary};
  text-decoration: none;
  font-size: ${theme.fontSizes.sm};
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.blue[500]};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.full};
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  color: ${theme.colors.primary};
  text-decoration: none;

  &:hover {
    background-color: ${theme.colors.surface};
    border-color: ${theme.colors.muted};
    transform: translateY(-1px);
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
  color: ${theme.colors.muted};
`;
