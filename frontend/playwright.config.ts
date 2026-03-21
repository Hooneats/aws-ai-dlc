import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    headless: false,
    screenshot: 'only-on-failure',
    launchOptions: { slowMo: 300 },
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
