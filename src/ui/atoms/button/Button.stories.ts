import type { Meta, StoryObj } from '@storybook/svelte';
import Button from './Button.svelte';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['accent', 'primary', 'secondary'],
      control: { type: 'radio' },
    }
  },
} satisfies Meta<Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Accent: Story = {
  args: {
    label: 'Accented Button',
    variant: 'accent', 
    title: 'Hello',
    isDisabled: false,
  },
};

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    variant: 'primary',
    title: 'Hello',
    isDisabled: false,
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    title: 'Hello',
    isDisabled: false,
    variant: 'secondary'
  },
};


export const Default: Story = {
  args: {
    label: 'Default Button',
    title: 'Hello',
    isDisabled: false,
  },
};
