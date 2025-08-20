import React from 'react';
import { Link } from 'gatsby';
import { Text } from './Text';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#111827',
      color: '#ffffff',
      padding: '3rem 0 2rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Text variant="h4" style={{ color: '#ffffff', fontWeight: 600, marginBottom: '0.5rem' }}>
            About Polo
          </Text>
          <Text variant="p" style={{ lineHeight: '1.6' }}>
            A personal book collection and reading tracker. Discover new books, 
            track your reading progress, and organize your literary journey.
          </Text>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Text variant="h4" style={{ color: '#ffffff', fontWeight: 600, marginBottom: '0.5rem' }}>
            Quick Links
          </Text>
          <Link to="/" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.2s ease' }}>
            Home
          </Link>
          <Link to="/search" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.2s ease' }}>
            Search Books
          </Link>
          <Link to="/bookshelf" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.2s ease' }}>
            My Bookshelf
          </Link>
          <Link to="/project" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.2s ease' }}>
            About
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Text variant="h4" style={{ color: '#ffffff', fontWeight: 600, marginBottom: '0.5rem' }}>
            Resources
          </Text>
          <Link to="/search-results" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.2s ease' }}>
            Browse All Books
          </Link>
          <Link to="/bookshelf" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.2s ease' }}>
            Reading Lists
          </Link>
          <a 
            href="https://openlibrary.org" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.2s ease' }}
          >
            Open Library
          </a>
          <a 
            href="https://goodreads.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.2s ease' }}
          >
            Goodreads
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Text variant="h4" style={{ color: '#ffffff', fontWeight: 600, marginBottom: '0.5rem' }}>
            Connect
          </Text>
          <Text variant="p">Follow us for reading recommendations and updates.</Text>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                backgroundColor: '#4b5563',
                borderRadius: '50%',
                transition: 'background-color 0.2s ease',
                color: '#ffffff',
                textDecoration: 'none'
              }}
            >
              📚
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Twitter"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                backgroundColor: '#4b5563',
                borderRadius: '50%',
                transition: 'background-color 0.2s ease',
                color: '#ffffff',
                textDecoration: 'none'
              }}
            >
              🐦
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                backgroundColor: '#4b5563',
                borderRadius: '50%',
                transition: 'background-color 0.2s ease',
                color: '#ffffff',
                textDecoration: 'none'
              }}
            >
              📷
            </a>
          </div>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        paddingTop: '2rem',
        borderTop: '1px solid #4b5563',
        color: '#4b5563'
      }}>
        <Text variant="caption">
          © {currentYear} Polo Book Collection. Built with Gatsby and ❤️
        </Text>
      </div>
    </footer>
  );
};

export default Footer;
