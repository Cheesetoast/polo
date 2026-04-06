import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

// Mock Gatsby Link
jest.mock('gatsby', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock components
jest.mock('../Text', () => ({
  Text: ({ children, variant, ...props }: any) => (
    <div data-testid={`text-${variant}`} {...props}>
      {children}
    </div>
  ),
}));

describe('Footer', () => {
  it('renders the footer with all sections', () => {
    render(<Footer />);
    
    // Check for main sections
    expect(screen.getByText('About Book Stack')).toBeInTheDocument();
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });

  it('renders about section with description', () => {
    render(<Footer />);
    
    expect(screen.getByText(/A personal book collection and reading tracker/)).toBeInTheDocument();
  });

  it('renders quick links section with navigation', () => {
    render(<Footer />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search Books')).toBeInTheDocument();
    expect(screen.getByText('Bookshelf')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Styleguide')).toBeInTheDocument();
  });

  it('renders resources section with external links', () => {
    render(<Footer />);
    
    expect(screen.getByText('Browse All Books')).toBeInTheDocument();
    expect(screen.getByText('Reading Lists')).toBeInTheDocument();
    expect(screen.getByText('Open Library')).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
    expect(screen.getByText(/Built with Gatsby and ❤️/)).toBeInTheDocument();
  });

  it('renders quick links with correct hrefs', () => {
    render(<Footer />);
    
    const homeLink = screen.getByText('Home');
    const searchLink = screen.getByText('Search Books');
    const bookshelfLink = screen.getByRole('link', { name: 'Bookshelf' });
    const aboutLink = screen.getByText('About');
    const styleguideLink = screen.getByText('Styleguide');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(searchLink).toHaveAttribute('href', '/search');
    expect(bookshelfLink).toHaveAttribute('href', '/bookshelf');
    expect(aboutLink).toHaveAttribute('href', '/project');
    expect(styleguideLink).toHaveAttribute('href', '/styleguide');
  });

  it('renders resource links with correct hrefs', () => {
    render(<Footer />);
    
    const browseLink = screen.getByText('Browse All Books');
    const readingListsLink = screen.getByText('Reading Lists');
    const openLibraryLink = screen.getByText('Open Library');

    expect(browseLink).toHaveAttribute('href', '/search-results');
    expect(readingListsLink).toHaveAttribute('href', '/bookshelf');
    expect(openLibraryLink).toHaveAttribute('href', 'https://openlibrary.org');
  });

  it('renders external links with proper attributes', () => {
    render(<Footer />);
    
    const openLibraryLink = screen.getByText('Open Library');

    expect(openLibraryLink).toHaveAttribute('target', '_blank');
    expect(openLibraryLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
