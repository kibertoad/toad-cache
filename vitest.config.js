import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: false,
    watch: false,
    environment: 'node',
    reporters: ['verbose'],
    coverage: {
      include: ['src/*.js'],
      reporter: ['text', 'json', 'html'],
      all: true,
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
})
