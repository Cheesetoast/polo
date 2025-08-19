import React from 'react';
import { render } from '@testing-library/react';
import Layout from '../Layout';

describe('Layout', () => {
  it('renders children inside main content', () => {
    const { getByText } = render(<Layout><div>child</div></Layout>);
    expect(getByText('child')).toBeInTheDocument();
  });

  it('renders with transparent navbar option', () => {
    const { container } = render(<Layout transparentNavbar><div>child</div></Layout>);
    expect(container.firstChild).toBeTruthy();
  });
});
