import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'miniflare',
    environmentOptions: {
      bindings: {
        ENVIRONMENT: 'test',
        API_VERSION: 'v1',
        CONTACT_EMAIL: 'test@myesimplus.com',
        RATE_LIMIT_MAX: '1000',
        RATE_LIMIT_WINDOW: '60000'
      },
      kvNamespaces: ['CONTACTS', 'ANALYTICS'],
      r2Buckets: ['ASSETS']
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.test.js',
        '**/*.spec.js',
        'coverage/',
        '.wrangler/'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    testTimeout: 10000,
    hookTimeout: 10000
  }
});