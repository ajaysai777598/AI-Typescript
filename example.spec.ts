import { test, expect } from './fixtures/test';
import { PlaywrightHomePage } from './pages/PlaywrightHomePage';

test('has title', async ({ page }) => {
  const playwrightHomePage = new PlaywrightHomePage(page);
  await playwrightHomePage.open();

  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  const playwrightHomePage = new PlaywrightHomePage(page);
  await playwrightHomePage.open();

  await playwrightHomePage.openGettingStarted();

  await expect(playwrightHomePage.installationHeading).toBeVisible();
});
