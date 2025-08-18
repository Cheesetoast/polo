import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ImageBlock } from './ImageBlock';

// Mock Gatsby image data
const mockGatsbyImageData = {
  layout: 'constrained' as const,
  width: 300,
  height: 400,
  images: {
    fallback: {
      src: 'https://via.placeholder.com/300x400/4A5568/FFFFFF?text=Image',
      srcSet: 'https://via.placeholder.com/300x400/4A5568/FFFFFF?text=Image',
      sizes: '(max-width: 300px) 100vw, 300px',
    },
    sources: [],
  },
  backgroundColor: '#4A5568',
};

const meta: Meta<typeof ImageBlock> = {
  title: 'Components/ImageBlock',
  component: ImageBlock,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A wrapper component for Gatsby images that ensures they display as block elements with full width.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    image: {
      description: 'Gatsby image data object',
      control: false,
    },
    alt: {
      description: 'Alt text for the image',
      control: { type: 'text' },
    },
    className: {
      description: 'Additional CSS class name',
      control: { type: 'text' },
    },
    style: {
      description: 'Additional inline styles',
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageBlock>;

export const Default: Story = {
  args: {
    image: mockGatsbyImageData,
    alt: 'Example image',
  },
};

export const WithCustomStyling: Story = {
  args: {
    image: mockGatsbyImageData,
    alt: 'Styled image',
    style: {
      border: '3px solid #e74c3c',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  },
};

export const WithCustomClassName: Story = {
  args: {
    image: mockGatsbyImageData,
    alt: 'Image with custom class',
    className: 'custom-image-block',
  },
};

export const ResponsiveImage: Story = {
  args: {
    image: {
      ...mockGatsbyImageData,
      width: 800,
      height: 600,
      images: {
        fallback: {
          src: 'https://via.placeholder.com/800x600/27AE60/FFFFFF?text=Responsive+Image',
          srcSet: 'https://via.placeholder.com/400x300/27AE60/FFFFFF?text=Responsive+Image 400w, https://via.placeholder.com/800x600/27AE60/FFFFFF?text=Responsive+Image 800w',
          sizes: '(min-width: 800px) 800px, (min-width: 400px) 400px, 100vw',
        },
        sources: [],
      },
    },
    alt: 'Responsive image example',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the ImageBlock handles responsive images with different sizes.',
      },
    },
  },
};

export const SquareImage: Story = {
  args: {
    image: {
      ...mockGatsbyImageData,
      width: 300,
      height: 300,
      images: {
        fallback: {
          src: 'https://via.placeholder.com/300x300/F39C12/FFFFFF?text=Square+Image',
          srcSet: 'https://via.placeholder.com/300x300/F39C12/FFFFFF?text=Square+Image 300w',
          sizes: '(min-width: 300px) 300px, 100vw',
        },
        sources: [],
      },
    },
    alt: 'Square image example',
  },
};

export const PortraitImage: Story = {
  args: {
    image: {
      ...mockGatsbyImageData,
      width: 300,
      height: 500,
      images: {
        fallback: {
          src: 'https://via.placeholder.com/300x500/9B59B6/FFFFFF?text=Portrait+Image',
          srcSet: 'https://via.placeholder.com/300x500/9B59B6/FFFFFF?text=Portrait+Image 300w',
          sizes: '(min-width: 300px) 300px, 100vw',
        },
        sources: [],
      },
    },
    alt: 'Portrait image example',
  },
};

export const WithBorderAndShadow: Story = {
  args: {
    image: mockGatsbyImageData,
    alt: 'Image with border and shadow',
    style: {
      border: '2px solid #34495e',
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
      padding: '8px',
      backgroundColor: '#ecf0f1',
    },
  },
};

export const CenteredImage: Story = {
  args: {
    image: mockGatsbyImageData,
    alt: 'Centered image',
    style: {
      maxWidth: '300px',
      margin: '0 auto',
      display: 'block',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how to center an image using custom styles.',
      },
    },
  },
};
