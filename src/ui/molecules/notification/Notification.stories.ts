import type { Meta, StoryObj } from '@storybook/svelte';
import Notification from './Notification.svelte';

const meta = {
  title: 'Molecules/Notification',
  component: Notification,
  tags: ['autodocs'],
  argTypes: {
    notification: {
      level: {
        options: ['success', 'failure', 'info'],
      control: { type: 'radio' },
      },
      message: {
        control: { type: 'text' }, 
      }
    },
  },
} satisfies Meta<Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    notification: {
      level: 'success',
      message: 'Team "BDSP Main" has been deleted successfully!',
    },
  },
};

export const Failure: Story = {
  args: {
    notification: {
      level: 'failure',
      message: 'Failed to remove Pokemon from tag, please try again',
    },
  },
};

export const Info: Story = {
  args: {
    notification: {
      level: 'info',
      message: 'Your account password has been updated',
    },
  },
};