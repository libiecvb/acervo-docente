import type { Preview } from '@storybook/react'
import '../app/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      expanded: true,
      hideNoControlsWarning: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: {
        rules: [
          { id: 'heading-order', enabled: false },
        ],
      },
    },
    docs: {
      theme: undefined,
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background text-foreground p-4">
        <Story />
      </div>
    ),
  ],
}

export default preview
