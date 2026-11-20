import { test as base, expect } from '@playwright/test';
import { captureFailedTestScreenshot } from '../utils/failedTestScreenshot';

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await use(page);

    if (testInfo.status !== testInfo.expectedStatus) {
      await captureFailedTestScreenshot(page, testInfo);
    }
  },
});

export { expect };