import React from 'react';
import { render, screen } from '@testing-library/react';
import { Text } from '../Text';

describe('Text Component', () => {
  it('renders text content', () => {
    render(<Text>Hello World</Text>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders with h1 variant', () => {
    render(<Text variant="h1">Heading 1</Text>);
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
  });

  it('renders with h2 variant', () => {
    render(<Text variant="h2">Heading 2</Text>);
    expect(screen.getByText('Heading 2')).toBeInTheDocument();
  });

  it('renders with h3 variant', () => {
    render(<Text variant="h3">Heading 3</Text>);
    expect(screen.getByText('Heading 3')).toBeInTheDocument();
  });

  it('renders with p variant', () => {
    render(<Text variant="p">Paragraph text</Text>);
    expect(screen.getByText('Paragraph text')).toBeInTheDocument();
  });

  it('renders with caption variant', () => {
    render(<Text variant="caption">Caption text</Text>);
    expect(screen.getByText('Caption text')).toBeInTheDocument();
  });

  it('renders with small size', () => {
    render(<Text size="small">Small text</Text>);
    expect(screen.getByText('Small text')).toBeInTheDocument();
  });

  it('renders with medium size', () => {
    render(<Text size="medium">Medium text</Text>);
    expect(screen.getByText('Medium text')).toBeInTheDocument();
  });

  it('renders with large size', () => {
    render(<Text size="large">Large text</Text>);
    expect(screen.getByText('Large text')).toBeInTheDocument();
  });

  it('renders with light weight', () => {
    render(<Text weight="light">Light text</Text>);
    expect(screen.getByText('Light text')).toBeInTheDocument();
  });

  it('renders with normal weight', () => {
    render(<Text weight="normal">Normal text</Text>);
    expect(screen.getByText('Normal text')).toBeInTheDocument();
  });

  it('renders with medium weight', () => {
    render(<Text weight="medium">Medium weight text</Text>);
    expect(screen.getByText('Medium weight text')).toBeInTheDocument();
  });

  it('renders with bold weight', () => {
    render(<Text weight="bold">Bold text</Text>);
    expect(screen.getByText('Bold text')).toBeInTheDocument();
  });

  it('renders with primary color', () => {
    render(<Text color="primary">Primary colored text</Text>);
    expect(screen.getByText('Primary colored text')).toBeInTheDocument();
  });

  it('renders with secondary color', () => {
    render(<Text color="secondary">Secondary colored text</Text>);
    expect(screen.getByText('Secondary colored text')).toBeInTheDocument();
  });

  it('renders with muted color', () => {
    render(<Text color="muted">Muted colored text</Text>);
    expect(screen.getByText('Muted colored text')).toBeInTheDocument();
  });

  it('renders with left alignment', () => {
    render(<Text align="left">Left aligned text</Text>);
    expect(screen.getByText('Left aligned text')).toBeInTheDocument();
  });

  it('renders with center alignment', () => {
    render(<Text align="center">Center aligned text</Text>);
    expect(screen.getByText('Center aligned text')).toBeInTheDocument();
  });

  it('renders with right alignment', () => {
    render(<Text align="right">Right aligned text</Text>);
    expect(screen.getByText('Right aligned text')).toBeInTheDocument();
  });

  it('renders with truncate prop', () => {
    render(<Text truncate>This is a very long text that should be truncated</Text>);
    expect(screen.getByText('This is a very long text that should be truncated')).toBeInTheDocument();
  });

  it('passes through custom className', () => {
    render(<Text className="custom-class">Custom class text</Text>);
    const textElement = screen.getByText('Custom class text');
    expect(textElement).toHaveClass('custom-class');
  });

  it('passes through custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    render(<Text style={customStyle}>Styled text</Text>);
    expect(screen.getByText('Styled text')).toBeInTheDocument();
  });

  it('renders with multiple props combined', () => {
    render(
      <Text 
        variant="h2" 
        size="large" 
        weight="bold" 
        color="primary" 
        align="center"
      >
        Complex text
      </Text>
    );
    expect(screen.getByText('Complex text')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    render(<Text>Default text</Text>);
    expect(screen.getByText('Default text')).toBeInTheDocument();
  });
});
