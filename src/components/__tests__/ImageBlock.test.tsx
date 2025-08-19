import React from 'react';
import { render } from '@testing-library/react';
import { ImageBlock } from '../ImageBlock';

const mockImg: any = { mock: true };

describe('ImageBlock', () => {
  it('renders wrapper and image when image provided', () => {
    const { container } = render(<ImageBlock image={mockImg} alt="alt" />);
    expect(container.querySelector('img')).toBeTruthy();
  });

  it('returns null when getImage returns falsy', () => {
    jest.doMock('gatsby-plugin-image', () => ({ GatsbyImage: () => null, getImage: () => null }));
    const { container } = render(<ImageBlock image={null as any} alt="alt" />);
    expect(container.firstChild).toBeNull();
  });
});
