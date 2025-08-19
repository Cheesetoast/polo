import React from 'react';
import { render } from '@testing-library/react';
import SEO from '../SEO';

describe('SEO', () => {
  it('renders basic meta tags and title', () => {
    render(<SEO />);
    expect(document.querySelector('title')).toBeTruthy();
    expect(document.querySelector('meta[name="description"]')).toBeTruthy();
    expect(document.querySelector('meta[property="og:type"]')).toBeTruthy();
    expect(document.querySelector('meta[property="twitter:card"]')).toBeTruthy();
  });

  it('supports article-specific tags when type is article', () => {
    render(<SEO type="article" publishedTime="2023-01-01" modifiedTime="2023-01-02" />);
    expect(document.querySelector('meta[property="article:published_time"]')).toBeTruthy();
    expect(document.querySelector('meta[property="article:modified_time"]')).toBeTruthy();
  });
});
