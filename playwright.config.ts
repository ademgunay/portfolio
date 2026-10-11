import { defineConfig, devices } from '@playwright/test';
import { BASE } from './site.config.mjs';

const base = `${BASE.replace(/\/+$/, '')}/`;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://localhost:4321', permissions: ['clipboard-read', 'clipboard-write'] },
  webServer: {
    // CI builds once in the test job before this runs; locally build then preview.
    command: process.env.CI ? 'npm run preview' : 'npm run build && npm run preview',
    url: `http://localhost:4321${base}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /motion\.spec\.ts|apps\.spec\.ts|mobile\.spec\.ts/ },
  ],
});
