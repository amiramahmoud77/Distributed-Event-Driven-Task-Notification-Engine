import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // Each test file gets its own in-memory database, so run them one at a time.
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 60000,
    env: {
      JWT_SECRET: 'test-secret-only-for-tests',
      NODE_ENV: 'test',
    },
  },
});