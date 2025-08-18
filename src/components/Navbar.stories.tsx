import type { Meta, StoryObj } from '@storybook/react';
import Navbar from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A responsive navigation bar component with transparent/scrolled states, mobile menu, and navigation links.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    transparent: {
      description: 'Whether the navbar should be transparent initially',
      control: { type: 'boolean' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh' }}>
        <Story />
        <div style={{ 
          padding: '120px 20px 20px', 
          backgroundColor: '#f5f5f5',
          minHeight: '100vh'
        }}>
          <h1>Page Content</h1>
          <p>This is the page content that appears below the navbar.</p>
          <p>Scroll down to see the navbar's scrolled state behavior.</p>
          <div style={{ height: '200vh', padding: '20px' }}>
            <p>More content to enable scrolling...</p>
            <p>Keep scrolling to see the navbar change appearance.</p>
          </div>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {
    transparent: false,
  },
};

export const Transparent: Story = {
  args: {
    transparent: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Navbar starts transparent and becomes opaque when scrolled.',
      },
    },
  },
};

export const WithBackground: Story = {
  args: {
    transparent: false,
  },
  decorators: [
    (Story) => (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Story />
        <div style={{ 
          padding: '120px 20px 20px', 
          color: 'white',
          minHeight: '100vh'
        }}>
          <h1>Page Content</h1>
          <p>This navbar has a solid background and works well on colored backgrounds.</p>
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Navbar with solid background on a gradient page background.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    transparent: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Navbar in mobile view showing the hamburger menu.',
      },
    },
  },
};

export const TabletView: Story = {
  args: {
    transparent: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Navbar in tablet view.',
      },
    },
  },
};

export const DesktopView: Story = {
  args: {
    transparent: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Navbar in desktop view showing all navigation links.',
      },
    },
  },
};

export const TransparentOnGradient: Story = {
  args: {
    transparent: true,
  },
  decorators: [
    (Story) => (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite'
      }}>
        <style>
          {`
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}
        </style>
        <Story />
        <div style={{ 
          padding: '120px 20px 20px', 
          color: 'white',
          minHeight: '100vh'
        }}>
          <h1>Hero Section</h1>
          <p>This navbar starts transparent and becomes opaque when scrolled.</p>
          <p>Perfect for hero sections with background images or gradients.</p>
          <div style={{ height: '200vh', padding: '20px' }}>
            <p>Scroll down to see the navbar change appearance...</p>
          </div>
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Transparent navbar on an animated gradient background.',
      },
    },
  },
};
