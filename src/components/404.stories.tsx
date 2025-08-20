import type { Meta, StoryObj } from '@storybook/react';
import NotFoundPage from '../pages/404';

// Mock Gatsby's navigate function
const mockNavigate = jest.fn();

jest.mock('gatsby', () => ({
  navigate: mockNavigate,
}));

const meta: Meta<typeof NotFoundPage> = {
  title: 'Pages/404',
  component: NotFoundPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh' }}>
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

export const WithCustomStyling: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
};
