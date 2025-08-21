import '@testing-library/jest-dom';
import React from 'react';

// Note: @dnd-kit mocks are handled locally in individual test files that need them

// Mock Gatsby's Link component
jest.mock('gatsby', () => ({
  Link: ({ children, to, ...rest }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
  graphql: jest.fn(),
  useStaticQuery: jest.fn(),
}));

// Mock gatsby-plugin-image
jest.mock('gatsby-plugin-image', () => ({
  GatsbyImage: ({ alt }) => <img alt={alt} />,
  getImage: (img) => img,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
// @ts-ignore
global.localStorage = localStorageMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
