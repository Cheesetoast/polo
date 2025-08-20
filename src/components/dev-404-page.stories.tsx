import type { Meta, StoryObj } from '@storybook/react';
import Dev404Page from '../pages/dev-404-page';

const meta: Meta<typeof Dev404Page> = {
  title: 'Pages/Dev404Page',
  component: Dev404Page,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
