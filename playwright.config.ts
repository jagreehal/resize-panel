import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const PORT = 9341;

export default defineConfig({
  testDir: './test',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? '50%' : undefined,
  timeout: 30_000,
  expect: { timeout: 7_500 },
  reporter: isCI ? [['list'], ['junit', { outputFile: 'test-results/junit.xml' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: `pnpm serve --no-port-switching --no-clipboard -l ${PORT} .`,
    url: `http://localhost:${PORT}/test/pages/panel.html`,
    reuseExistingServer: !isCI,
  },
});
