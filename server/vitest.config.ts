import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.{ts,js}'],
    environment: 'node',
    restoreMocks: true,
    hookTimeout: 30000,
    testTimeout: 30000,
  },
});
