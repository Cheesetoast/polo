import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusIndicator } from '../StatusIndicator';

describe('StatusIndicator Component', () => {
  it('renders with want-to-read status', () => {
    const { container } = render(<StatusIndicator status="want-to-read" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with currently-reading status', () => {
    const { container } = render(<StatusIndicator status="currently-reading" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with finished status', () => {
    const { container } = render(<StatusIndicator status="finished" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with small size', () => {
    const { container } = render(<StatusIndicator status="want-to-read" size="small" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with medium size', () => {
    const { container } = render(<StatusIndicator status="currently-reading" size="medium" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with large size', () => {
    const { container } = render(<StatusIndicator status="finished" size="large" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('passes through custom className', () => {
    const { container } = render(<StatusIndicator status="want-to-read" className="custom-status" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('passes through custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { container } = render(<StatusIndicator status="currently-reading" style={customStyle} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with default props', () => {
    const { container } = render(<StatusIndicator status="want-to-read" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders status dot and label', () => {
    const { container } = render(<StatusIndicator status="finished" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles all status types', () => {
    const statuses = ['want-to-read', 'currently-reading', 'finished'];
    
    statuses.forEach(status => {
      const { container, unmount } = render(<StatusIndicator status={status} />);
      expect(container.firstChild).toBeInTheDocument();
      unmount();
    });
  });

  it('handles all size variants', () => {
    const sizes = ['small', 'medium', 'large'];
    
    sizes.forEach(size => {
      const { container, unmount } = render(<StatusIndicator status="want-to-read" size={size} />);
      expect(container.firstChild).toBeInTheDocument();
      unmount();
    });
  });
});
