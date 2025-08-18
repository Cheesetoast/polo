import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BookProgressBar } from './BookProgressBar';

const meta: Meta<typeof BookProgressBar> = {
  title: 'Components/BookProgressBar',
  component: BookProgressBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A progress bar component for displaying reading progress of books. Shows a percentage and visual progress bar with smooth animations.',
      },
    },
  },
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress percentage (0-100)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class name',
    },
    style: {
      control: 'object',
      description: 'Additional inline styles',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    progress: 50,
  },
};

// Various progress states
export const Empty: Story = {
  args: {
    progress: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar showing 0% completion - book not started.',
      },
    },
  },
};

export const JustStarted: Story = {
  args: {
    progress: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar showing just started reading (5%).',
      },
    },
  },
};

export const Halfway: Story = {
  args: {
    progress: 50,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar showing halfway through the book (50%).',
      },
    },
  },
};

export const AlmostFinished: Story = {
  args: {
    progress: 85,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar showing almost finished reading (85%).',
      },
    },
  },
};

export const Completed: Story = {
  args: {
    progress: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar showing completed book (100%).',
      },
    },
  },
};

// Interactive story
export const Interactive: Story = {
  args: {
    progress: 25,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive progress bar - use the controls to adjust the progress value.',
      },
    },
  },
};

// Multiple progress bars
export const MultipleBars: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <BookProgressBar progress={0} />
      <BookProgressBar progress={25} />
      <BookProgressBar progress={50} />
      <BookProgressBar progress={75} />
      <BookProgressBar progress={100} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple progress bars showing different completion states.',
      },
    },
  },
};

// With custom styling
export const CustomStyling: Story = {
  args: {
    progress: 60,
    style: {
      padding: '16px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar with custom styling applied.',
      },
    },
  },
};

// Different widths
export const DifferentWidths: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '200px' }}>
        <BookProgressBar progress={75} />
      </div>
      <div style={{ width: '300px' }}>
        <BookProgressBar progress={75} />
      </div>
      <div style={{ width: '400px' }}>
        <BookProgressBar progress={75} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Progress bars with different container widths.',
      },
    },
  },
};

// Edge cases
export const UndefinedProgress: Story = {
  args: {
    progress: undefined as any,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar with undefined progress value (defaults to 0%).',
      },
    },
  },
};

export const NegativeProgress: Story = {
  args: {
    progress: -10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar with negative value (should clamp to 0%).',
      },
    },
  },
};

export const Over100Progress: Story = {
  args: {
    progress: 120,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar with value over 100% (should clamp to 100%).',
      },
    },
  },
};
