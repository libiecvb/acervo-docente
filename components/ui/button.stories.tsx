import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'
import { Loader2 } from 'lucide-react'

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
    disabled: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Button',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
}

export const Icon: Story = {
  args: {
    variant: 'outline',
    size: 'icon',
    children: <Loader2 className="h-4 w-4" />,
    'aria-label': 'Loading',
  },
}

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading
      </>
    ),
  },
}
