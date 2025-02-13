import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    alias: {
      obsidian: path.resolve(__dirname, './tests/__mocks__/obsidian.ts'),
    },
  },
})
