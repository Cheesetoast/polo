import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile text component that can render as headers, paragraphs, labels, and more with customizable styling.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label', 'caption'],
      description: 'The semantic variant of the text element',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'],
      description: 'The font size of the text',
    },
    weight: {
      control: { type: 'select' },
      options: ['light', 'normal', 'medium', 'semibold', 'bold', 'extrabold'],
      description: 'The font weight of the text',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'muted', 'success', 'error', 'warning'],
      description: 'The color variant of the text',
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
      description: 'The text alignment',
    },
    truncate: {
      control: { type: 'boolean' },
      description: 'Whether to truncate text with ellipsis',
    },
    children: {
      control: { type: 'text' },
      description: 'The text content',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: 'This is default text',
    variant: 'p',
  },
};

// Header variants
export const H1: Story = {
  args: {
    children: 'Heading 1',
    variant: 'h1',
  },
};

export const H2: Story = {
  args: {
    children: 'Heading 2',
    variant: 'h2',
  },
};

export const H3: Story = {
  args: {
    children: 'Heading 3',
    variant: 'h3',
  },
};

export const H4: Story = {
  args: {
    children: 'Heading 4',
    variant: 'h4',
  },
};

export const H5: Story = {
  args: {
    children: 'Heading 5',
    variant: 'h5',
  },
};

export const H6: Story = {
  args: {
    children: 'Heading 6',
    variant: 'h6',
  },
};

// Paragraph
export const Paragraph: Story = {
  args: {
    children: 'This is a paragraph of text. It can contain multiple sentences and will wrap naturally to multiple lines when needed.',
    variant: 'p',
  },
  parameters: {
    layout: 'padded',
  },
};

// Label
export const Label: Story = {
  args: {
    children: 'Form Label',
    variant: 'label',
  },
};

// Caption
export const Caption: Story = {
  args: {
    children: 'This is a caption text',
    variant: 'caption',
  },
};

// Size variants
export const ExtraSmall: Story = {
  args: {
    children: 'Extra Small Text (12px)',
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Text (14px)',
    size: 'sm',
  },
};

export const Base: Story = {
  args: {
    children: 'Base Text (16px)',
    size: 'base',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Text (18px)',
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    children: 'Extra Large Text (20px)',
    size: 'xl',
  },
};

export const TwoXL: Story = {
  args: {
    children: '2XL Text (24px)',
    size: '2xl',
  },
};

export const ThreeXL: Story = {
  args: {
    children: '3XL Text (30px)',
    size: '3xl',
  },
};

export const FourXL: Story = {
  args: {
    children: '4XL Text (36px)',
    size: '4xl',
  },
};

export const FiveXL: Story = {
  args: {
    children: '5XL Text (48px)',
    size: '5xl',
  },
};

// Weight variants
export const Light: Story = {
  args: {
    children: 'Light Weight Text',
    weight: 'light',
  },
};

export const Normal: Story = {
  args: {
    children: 'Normal Weight Text',
    weight: 'normal',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Weight Text',
    weight: 'medium',
  },
};

export const Semibold: Story = {
  args: {
    children: 'Semibold Weight Text',
    weight: 'semibold',
  },
};

export const Bold: Story = {
  args: {
    children: 'Bold Weight Text',
    weight: 'bold',
  },
};

export const Extrabold: Story = {
  args: {
    children: 'Extrabold Weight Text',
    weight: 'extrabold',
  },
};

// Color variants
export const Primary: Story = {
  args: {
    children: 'Primary Color Text',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Color Text',
    color: 'secondary',
  },
};

export const Muted: Story = {
  args: {
    children: 'Muted Color Text',
    color: 'muted',
  },
};

export const Success: Story = {
  args: {
    children: 'Success Color Text',
    color: 'success',
  },
};

export const Error: Story = {
  args: {
    children: 'Error Color Text',
    color: 'error',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning Color Text',
    color: 'warning',
  },
};

// Alignment variants
export const LeftAligned: Story = {
  args: {
    children: 'Left aligned text',
    align: 'left',
  },
  parameters: {
    layout: 'padded',
  },
};

export const CenterAligned: Story = {
  args: {
    children: 'Center aligned text',
    align: 'center',
  },
  parameters: {
    layout: 'padded',
  },
};

export const RightAligned: Story = {
  args: {
    children: 'Right aligned text',
    align: 'right',
  },
  parameters: {
    layout: 'padded',
  },
};

export const Justified: Story = {
  args: {
    children: 'This is justified text that will spread across the full width of its container, creating even spacing between words.',
    align: 'justify',
  },
  parameters: {
    layout: 'padded',
  },
};

// Truncated text
export const Truncated: Story = {
  args: {
    children: 'This is a very long text that will be truncated with an ellipsis when it exceeds the container width',
    truncate: true,
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '200px' }}>
        <Story />
      </div>
    ),
  ],
};

// All headers showcase
export const AllHeaders: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="h4">Heading 4</Text>
      <Text variant="h5">Heading 5</Text>
      <Text variant="h6">Heading 6</Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All heading variants displayed together for comparison.',
      },
    },
  },
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text size="xs">Extra Small (xs)</Text>
      <Text size="sm">Small (sm)</Text>
      <Text size="base">Base (base)</Text>
      <Text size="lg">Large (lg)</Text>
      <Text size="xl">Extra Large (xl)</Text>
      <Text size="2xl">2XL (2xl)</Text>
      <Text size="3xl">3XL (3xl)</Text>
      <Text size="4xl">4XL (4xl)</Text>
      <Text size="5xl">5XL (5xl)</Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All text sizes displayed together for comparison.',
      },
    },
  },
};

// All colors showcase
export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text color="primary">Primary Color</Text>
      <Text color="secondary">Secondary Color</Text>
      <Text color="muted">Muted Color</Text>
      <Text color="success">Success Color</Text>
      <Text color="error">Error Color</Text>
      <Text color="warning">Warning Color</Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All color variants displayed together for comparison.',
      },
    },
  },
};

// Typography scale example
export const TypographyScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Text variant="h1" color="primary">Welcome to Our Platform</Text>
        <Text variant="h2" color="secondary">Build amazing things</Text>
        <Text variant="p" color="muted">
          This is a comprehensive typography system that provides consistent text styling across your application. 
          Use the Text component to maintain visual hierarchy and improve readability.
        </Text>
      </div>
      
      <div>
        <Text variant="h3">Feature Highlights</Text>
        <Text variant="p">
          • Multiple variants for different use cases<br/>
          • Flexible sizing system<br/>
          • Color theming support<br/>
          • Responsive and accessible
        </Text>
      </div>
      
      <div>
        <Text variant="label">Form Label</Text>
        <Text variant="caption">Helper text or caption</Text>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'A complete typography scale example showing how different text variants work together.',
      },
    },
  },
};
