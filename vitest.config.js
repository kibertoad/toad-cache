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
      statements: 80,
      branches: 65,
      functions: 80,
      lines: 80,
    },
  },
})
