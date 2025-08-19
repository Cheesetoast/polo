import React from 'react';
import { render, screen } from '@testing-library/react';
import { BookProgressBar } from '../BookProgressBar';

describe('BookProgressBar Component', () => {
  it('renders progress percentage', () => {
    render(<BookProgressBar progress={75} />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('handles zero progress', () => {
    render(<BookProgressBar progress={0} />);
    
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('handles 100% progress', () => {
    render(<BookProgressBar progress={100} />);
    
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('clamps progress values', () => {
    render(<BookProgressBar progress={150} />);
    
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('handles negative progress values', () => {
    render(<BookProgressBar progress={-10} />);
    
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
