import type { Meta, StoryObj } from '@storybook/react';
import { StatusIndicator } from './StatusIndicator';

const meta: Meta<typeof StatusIndicator> = {
  title: 'Components/StatusIndicator',
  component: StatusIndicator,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A visual indicator component for displaying book reading status with colored dots and labels.',
      },
    },
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['want-to-read', 'currently-reading', 'finished'],
      description: 'The reading status to display',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the status indicator',
    },
    showLabel: {
      control: { type: 'boolean' },
      description: 'Whether to show the status label',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stories
export const WantToRead: Story = {
  args: {
    status: 'want-to-read',
    size: 'medium',
    showLabel: true,
  },
};

export const CurrentlyReading: Story = {
  args: {
    status: 'currently-reading',
    size: 'medium',
    showLabel: true,
  },
};

export const Finished: Story = {
  args: {
    status: 'finished',
    size: 'medium',
    showLabel: true,
  },
};

export const Small: Story = {
  args: {
    status: 'want-to-read',
    size: 'small',
    showLabel: true,
  },
};

export const Large: Story = {
  args: {
    status: 'currently-reading',
    size: 'large',
    showLabel: true,
  },
};

export const DotOnly: Story = {
  args: {
    status: 'finished',
    size: 'medium',
    showLabel: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Status indicator showing only the colored dot without the label.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>Small:</span>
        <StatusIndicator status="want-to-read" size="small" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>Medium:</span>
        <StatusIndicator status="currently-reading" size="medium" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>Large:</span>
        <StatusIndicator status="finished" size="large" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all three sizes of the status indicator.',
      },
    },
  },
};
