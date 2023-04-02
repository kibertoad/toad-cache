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
      statements: 95,
      branches: 90,
      functions: 100,
      lines: 95,
    },
  },
})
