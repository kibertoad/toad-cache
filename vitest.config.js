import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: false,
    watch: false,
    environment: 'node',
    reporters: ['verbose'],
    coverage: {
      include: ['src/**/*.js'],
      reporter: ['text', 'json', 'html'],
      all: true,
      lines: 50,
      functions: 50,
      branches: 40,
      statements: 50,
    },
  },
})
