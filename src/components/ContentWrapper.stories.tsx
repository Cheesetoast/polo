import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ContentWrapper } from './ContentWrapper';

const meta: Meta<typeof ContentWrapper> = {
  title: 'Components/ContentWrapper',
  component: ContentWrapper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A wrapper component that provides consistent max-width and responsive padding for content layout.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Content to be wrapped',
      control: false,
    },
    className: {
      description: 'Additional CSS class name',
      control: { type: 'text' },
    },
    as: {
      description: 'HTML element to render as',
      control: { type: 'select' },
      options: ['div', 'section', 'main', 'article'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContentWrapper>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '20px', 
        minHeight: '200px',
        textAlign: 'center'
      }}>
        <h2>Content Wrapper Example</h2>
        <p>This content is wrapped with consistent max-width and responsive padding.</p>
        <p>The wrapper ensures content doesn't get too wide on large screens and has appropriate margins on smaller screens.</p>
      </div>
    ),
  },
};

export const WithLongContent: Story = {
  args: {
    children: (
      <div style={{ 
        backgroundColor: '#e8f4fd', 
        padding: '20px',
        minHeight: '400px'
      }}>
        <h2>Long Content Example</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      </div>
    ),
  },
};

export const AsSection: Story = {
  args: {
    as: 'section',
    children: (
      <div style={{ 
        backgroundColor: '#fff3cd', 
        padding: '20px',
        minHeight: '200px',
        textAlign: 'center'
      }}>
        <h2>Section Wrapper</h2>
        <p>This content is wrapped in a section element instead of a div.</p>
      </div>
    ),
  },
};

export const WithCustomClassName: Story = {
  args: {
    className: 'custom-content-wrapper',
    children: (
      <div style={{ 
        backgroundColor: '#d1ecf1', 
        padding: '20px',
        minHeight: '200px',
        textAlign: 'center'
      }}>
        <h2>Custom Class Name</h2>
        <p>This wrapper has a custom CSS class applied.</p>
      </div>
    ),
  },
};

export const ResponsiveExample: Story = {
  args: {
    children: (
      <div style={{ 
        backgroundColor: '#f8d7da', 
        padding: '20px',
        minHeight: '300px'
      }}>
        <h2>Responsive Layout</h2>
        <p>This example demonstrates how the ContentWrapper adapts to different screen sizes:</p>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li><strong>Mobile:</strong> 24px padding on each side</li>
          <li><strong>Tablet (768px+):</strong> 48px padding on each side</li>
          <li><strong>Desktop (1024px+):</strong> 64px padding on each side</li>
          <li><strong>Max Width:</strong> 1200px</li>
        </ul>
        <p style={{ marginTop: '20px' }}>
          Try resizing your browser window to see the responsive behavior in action!
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the responsive padding behavior of the ContentWrapper component.',
      },
    },
  },
};
