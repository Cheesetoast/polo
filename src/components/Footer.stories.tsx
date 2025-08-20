import type { Meta, StoryObj } from '@storybook/react';
import Footer from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '2rem' }}>
          <h1>Page Content</h1>
          <p>This is the main content area. The footer will appear below.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithLongContent: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '2rem' }}>
          <h1>Page Content</h1>
          <p>This is the main content area with more content to push the footer down.</p>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i}>Content line {i + 1} to demonstrate footer positioning.</p>
          ))}
        </div>
        <Story />
      </div>
    ),
  ],
};
