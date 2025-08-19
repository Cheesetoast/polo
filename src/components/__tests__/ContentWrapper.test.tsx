import React from 'react';
import { render } from '@testing-library/react';
import { ContentWrapper } from '../ContentWrapper';

describe('ContentWrapper', () => {
  it('renders children', () => {
    const { getByText } = render(<ContentWrapper>content</ContentWrapper>);
    expect(getByText('content')).toBeInTheDocument();
  });

  it('supports custom element via as prop', () => {
    const { container } = render(<ContentWrapper as="section">x</ContentWrapper>);
    expect(container.querySelector('section')).toBeTruthy();
  });
});
