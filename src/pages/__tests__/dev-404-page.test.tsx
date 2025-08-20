import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dev404Page from '../dev-404-page';

// Mock Gatsby
jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}));

// Mock components
jest.mock('../../components/Text', () => ({
  Text: ({ children, variant, ...props }: any) => (
    <div data-testid={`text-${variant}`} {...props}>
      {children}
    </div>
  ),
}));

jest.mock('../../components/Button', () => ({
  Button: ({ children, onClick, variant, ...props }: any) => (
    <button data-testid={`button-${variant}`} onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('../../components/ButtonContainer', () => ({
  ButtonContainer: ({ children, ...props }: any) => (
    <div data-testid="button-container" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('../../components/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar" />;
  };
});

jest.mock('../../components/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

jest.mock('../../components/ContentWrapper', () => ({
  ContentWrapper: ({ children, ...props }: any) => (
    <div data-testid="content-wrapper" {...props}>
      {children}
    </div>
  ),
}));

describe('Dev404Page', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    require('gatsby').navigate = mockNavigate;
  });

  it('renders the 404 page with correct content', () => {
    render(<Dev404Page />);
    
    // Check for main elements
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText(/Well, this is awkward/)).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(<Dev404Page />);
    
    expect(screen.getByText('Go Home')).toBeInTheDocument();
    expect(screen.getByText('Search Books')).toBeInTheDocument();
    expect(screen.getByText('View Bookshelf')).toBeInTheDocument();
  });

  it('navigates to home when "Go Home" button is clicked', () => {
    render(<Dev404Page />);
    
    const homeButton = screen.getByText('Go Home');
    fireEvent.click(homeButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to search when "Search Books" button is clicked', () => {
    render(<Dev404Page />);
    
    const searchButton = screen.getByText('Search Books');
    fireEvent.click(searchButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/search');
  });

  it('navigates to bookshelf when "View Bookshelf" button is clicked', () => {
    render(<Dev404Page />);
    
    const bookshelfButton = screen.getByText('View Bookshelf');
    fireEvent.click(bookshelfButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/bookshelf');
  });

  it('shows development-specific message', () => {
    render(<Dev404Page />);
    
    expect(screen.getByText(/This is the development 404 page/)).toBeInTheDocument();
  });

  it('renders the navbar', () => {
    render(<Dev404Page />);
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});
