import type { Meta, StoryObj } from '@storybook/react';
import { ButtonContainer } from './ButtonContainer';
import { Button } from './Button';

const meta: Meta<typeof ButtonContainer> = {
  title: 'Components/ButtonContainer',
  component: ButtonContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible container component for grouping and arranging buttons with various layout options.',
      },
    },
  },
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Direction of button layout',
    },
    spacing: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Spacing between buttons',
    },
    alignment: {
      control: { type: 'select' },
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Alignment of buttons within the container',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default buttons for stories
const DefaultButtons = (
  <>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="outline">Outline</Button>
  </>
);

const ManyButtons = (
  <>
    <Button variant="primary" size="small">Small</Button>
    <Button variant="secondary" size="medium">Medium</Button>
    <Button variant="outline" size="large">Large</Button>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
  </>
);

// Stories
export const Default: Story = {
  args: {
    children: DefaultButtons,
  },
};

export const Horizontal: Story = {
  args: {
    children: DefaultButtons,
    direction: 'horizontal',
    spacing: 'md',
    alignment: 'center',
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal layout with centered alignment and medium spacing.',
      },
    },
  },
};

export const Vertical: Story = {
  args: {
    children: DefaultButtons,
    direction: 'vertical',
    spacing: 'md',
    alignment: 'center',
  },
  parameters: {
    docs: {
      description: {
        story: 'Vertical layout with centered alignment and medium spacing.',
      },
    },
  },
};

export const StartAligned: Story = {
  args: {
    children: DefaultButtons,
    direction: 'horizontal',
    spacing: 'md',
    alignment: 'start',
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal layout with start alignment.',
      },
    },
  },
};

export const EndAligned: Story = {
  args: {
    children: DefaultButtons,
    direction: 'horizontal',
    spacing: 'md',
    alignment: 'end',
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal layout with end alignment.',
      },
    },
  },
};

export const StretchAligned: Story = {
  args: {
    children: DefaultButtons,
    direction: 'horizontal',
    spacing: 'md',
    alignment: 'stretch',
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal layout with stretch alignment (buttons spread across container).',
      },
    },
  },
};

export const TightSpacing: Story = {
  args: {
    children: DefaultButtons,
    direction: 'horizontal',
    spacing: 'xs',
    alignment: 'center',
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal layout with extra small spacing between buttons.',
      },
    },
  },
};

export const LooseSpacing: Story = {
  args: {
    children: DefaultButtons,
    direction: 'horizontal',
    spacing: 'lg',
    alignment: 'center',
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal layout with large spacing between buttons.',
      },
    },
  },
};

export const ManyButtonsHorizontal: Story = {
  args: {
    children: ManyButtons,
    direction: 'horizontal',
    spacing: 'sm',
    alignment: 'center',
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple buttons in horizontal layout with small spacing.',
      },
    },
  },
};

export const ManyButtonsVertical: Story = {
  args: {
    children: ManyButtons,
    direction: 'vertical',
    spacing: 'sm',
    alignment: 'center',
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple buttons in vertical layout with small spacing.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  args: {
    children: ManyButtons,
    direction: 'horizontal',
    spacing: 'md',
    alignment: 'center',
  },
  parameters: {
    docs: {
      description: {
        story: 'Responsive layout that switches to vertical on mobile devices.',
      },
    },
  },
};
