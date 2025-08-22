import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { Text } from './Text';

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
  background-color: #111827;
  color: #ffffff;
  padding: 3rem 0 2rem;
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
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FooterText = styled(Text)`
  line-height: 1.6;
`;

const FooterLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #9ca3af;
  }
`;

const FooterExternalLink = styled.a`
  color: #ffffff;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #9ca3af;
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
  background-color: #4b5563;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  color: #ffffff;
  text-decoration: none;

  &:hover {
    background-color: #6b7280;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #4b5563;
  color: #4b5563;
`;
