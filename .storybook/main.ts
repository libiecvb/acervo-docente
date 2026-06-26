import { defineConfig } from 'storybook/internal/configuration'
import type { StorybookConfig } from '@storybook/react-webpack5-vite'

const config: StorybookConfig = {
  stories: [
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../app/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/react-webpack5-vite',
    options: {},
  },
  staticDirs: ['../public'],
  viteFinal: (config) => {
    config.css = { ...config.css, modules: { ...config.css?.modules } }
    config.css = {
      ...config.css,
      postcss: {
        plugins: [require('@tailwindcss/postcss')()],
      },
    }
    return config
  },
}

export default defineConfig(config)
