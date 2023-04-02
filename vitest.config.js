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
      statements: 90,
      branches: 75,
      functions: 100,
      lines: 90,
    },
  },
})
