import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'miniflare',
    environmentOptions: {
      bindings: {
        CACHE: 'test-cache',
        SESSIONS: 'test-sessions'
      }
    }
  }
});