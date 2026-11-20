import { createHash } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { Page, TestInfo } from '@playwright/test';

export async function captureFailedTestScreenshot(page: Page, testInfo: TestInfo): Promise<void> {
  const screenshotDirectory = path.resolve(testInfo.config.rootDir, 'failed-test-screenshots');
  await mkdir(screenshotDirectory, { recursive: true });

  const safeName = (value: string) => value.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 60);
  const testHash = createHash('sha1').update(testInfo.testId).digest('hex').slice(0, 8);
  const fileName = [
    safeName(path.basename(testInfo.file, path.extname(testInfo.file))),
    safeName(testInfo.title),
    safeName(testInfo.project.name),
    testHash,
    `retry-${testInfo.retry}`,
  ].join('-');
  const screenshotPath = path.join(screenshotDirectory, `${fileName}.png`);

  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach('failed-test-screenshot', {
    path: screenshotPath,
    contentType: 'image/png',
  });
}