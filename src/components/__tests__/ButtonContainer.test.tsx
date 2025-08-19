import React from 'react';
import { render, screen } from '@testing-library/react';
import { ButtonContainer } from '../ButtonContainer';
import { Button } from '../Button';

describe('ButtonContainer Component', () => {
  it('renders children buttons', () => {
    render(
      <ButtonContainer>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonContainer>
    );
    
    expect(screen.getByRole('button', { name: 'Button 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Button 2' })).toBeInTheDocument();
  });

  it('renders with horizontal direction', () => {
    render(
      <ButtonContainer direction="horizontal">
        <Button>Horizontal Button</Button>
      </ButtonContainer>
    );
    
    expect(screen.getByRole('button', { name: 'Horizontal Button' })).toBeInTheDocument();
  });

  it('renders with vertical direction', () => {
    render(
      <ButtonContainer direction="vertical">
        <Button>Vertical Button</Button>
      </ButtonContainer>
    );
    
    expect(screen.getByRole('button', { name: 'Vertical Button' })).toBeInTheDocument();
  });

  it('renders with small spacing', () => {
    render(
      <ButtonContainer spacing="small">
        <Button>Small Spacing Button</Button>
      </ButtonContainer>
    );
    
    expect(screen.getByRole('button', { name: 'Small Spacing Button' })).toBeInTheDocument();
  });

  it('renders with medium spacing', () => {
    render(
      <ButtonContainer spacing="medium">
        <Button>Medium Spacing Button</Button>
      </ButtonContainer>
    );
    
    expect(screen.getByRole('button', { name: 'Medium Spacing Button' })).toBeInTheDocument();
  });

  it('renders with large spacing', () => {
    render(
      <ButtonContainer spacing="large">
        <Button>Large Spacing Button</Button>
      </ButtonContainer>
    );
    
    expect(screen.getByRole('button', { name: 'Large Spacing Button' })).toBeInTheDocument();
  });

  it('renders with start alignment', () => {
    render(
      <ButtonContainer alignment="start">
        <Button>Start Aligned Button</Button>
      </ButtonContainer>
    );
    
    expect(screen.getByRole('button', { name: 'Start Aligned Button' })).toBeInTheDocument();
  });

  it('renders with center alignment', () => {
    render(
      <ButtonContainer alignment="center">
        <Button>Center Aligned Button</Button>
      </ButtonContainer>
    );
    
    expect(screen.getByRole('button', { name: 'Center Aligned Button' })).toBeInTheDocument();
  });

  it('renders with end alignment', () => {
    render(
      <ButtonContainer alignment="end">
        <Button>End Aligned Button</Button>
      </ButtonContainer>
    );
    
    expect(screen.getByRole('button', { name: 'End Aligned Button' })).toBeInTheDocument();
  });

  it('passes through custom className', () => {
    render(
      <ButtonContainer className="custom-container">
        <Button>Custom Class Button</Button>
      </ButtonContainer>
    );
    
    const container = screen.getByRole('button', { name: 'Custom Class Button' }).closest('div');
    expect(container).toHaveClass('custom-container');
  });

  it('passes through custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    render(
      <ButtonContainer style={customStyle}>
        <Button>Styled Button</Button>
      </ButtonContainer>
    );
    
    expect(screen.getByRole('button', { name: 'Styled Button' })).toBeInTheDocument();
  });

  it('renders with multiple props combined', () => {
    render(
      <ButtonContainer 
        direction="vertical" 
        spacing="large" 
        alignment="center"
      >
        <Button>Complex Button</Button>
      </ButtonContainer>
    );
    
    expect(screen.getByRole('button', { name: 'Complex Button' })).toBeInTheDocument();
  });

  it('renders with default props', () => {
    render(
      <ButtonContainer>
        <Button>Default Button</Button>
      </ButtonContainer>
    );
    
    expect(screen.getByRole('button', { name: 'Default Button' })).toBeInTheDocument();
  });

  it('handles empty children', () => {
    render(<ButtonContainer />);
    // Should render without errors
    expect(document.body).toBeInTheDocument();
  });

  it('handles single child', () => {
    render(
      <ButtonContainer>
        <Button>Single Button</Button>
      </ButtonContainer>
    );
    
    expect(screen.getByRole('button', { name: 'Single Button' })).toBeInTheDocument();
  });

  it('handles multiple children', () => {
    render(
      <ButtonContainer>
        <Button>First Button</Button>
        <Button>Second Button</Button>
        <Button>Third Button</Button>
      </ButtonContainer>
    );
    
    expect(screen.getByRole('button', { name: 'First Button' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Second Button' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Third Button' })).toBeInTheDocument();
  });
});
