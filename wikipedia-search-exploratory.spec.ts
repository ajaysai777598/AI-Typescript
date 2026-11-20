import { test, expect } from './fixtures/test';
import { WikipediaHomePage } from './pages/WikipediaHomePage';
import { WikipediaSearchResultsPage } from './pages/WikipediaSearchResultsPage';

test.describe('Wikipedia search exploratory testing', () => {
  test('homepage search field is available and accepts input', async ({ page }) => {
    const homePage = new WikipediaHomePage(page);
    await homePage.open();

    await expect(homePage.searchInput).toBeVisible();
    await expect(homePage.searchInput).toBeEnabled();
    await homePage.enterSearchQuery('Playwright');
    await expect(homePage.searchInput).toHaveValue('Playwright');
  });

  test('empty search redirects to Special:Search', async ({ page }) => {
    const homePage = new WikipediaHomePage(page);
    await homePage.open();

    await homePage.enterSearchQuery('');
    await homePage.submitSearchWithEnter();

    await expect(page).toHaveURL(/wikipedia\.org\/wiki\/Special:Search\?search=/);
  });

  test('special characters search works', async ({ page }) => {
    const homePage = new WikipediaHomePage(page);
    const resultsPage = new WikipediaSearchResultsPage(page);
    await homePage.open();

    await homePage.enterSearchQuery('Café & 東京');
    await homePage.submitSearchWithEnter();

    await expect(page).toHaveURL(/wikipedia\.org\/wiki\/Special:Search\?search=/);
    await expect(resultsPage.body).toContainText('Café');
  });

  test('whitespace-only search can be submitted', async ({ page }) => {
    const homePage = new WikipediaHomePage(page);
    await homePage.open();

    await homePage.enterSearchQuery('   ');
    await homePage.submitSearchWithEnter();

    await expect(page).toHaveURL(/wikipedia\.org\/wiki\/Special:Search\?search=/);
  });

  test('search button submits a query and opens a results page', async ({ page }) => {
    const homePage = new WikipediaHomePage(page);
    const resultsPage = new WikipediaSearchResultsPage(page);
    await homePage.open();

    await homePage.enterSearchQuery('Playwright');
    await homePage.submitSearchWithButton();

    await expect(page).toHaveURL(/wikipedia\.org\/wiki\//);
    await expect(resultsPage.body).toContainText('Playwright');
  });

  test('search results page provides an input for refinement', async ({ page }) => {
    const homePage = new WikipediaHomePage(page);
    await homePage.open();

    await homePage.enterSearchQuery('zxqv-no-wikipedia-page-9283746501');
    await homePage.submitSearchWithEnter();

    await expect(page).toHaveURL(/wikipedia\.org\/wiki\//);
    const resultsPage = new WikipediaSearchResultsPage(page);
    await expect(page).toHaveURL(/\/wiki\/Special:Search\?/);
    await expect(resultsPage.searchInput).toBeVisible();
    await expect(resultsPage.searchInput).toBeEnabled();
  });

  test('search results page submits a refined query', async ({ page }) => {
    const homePage = new WikipediaHomePage(page);
    await homePage.open();

    await homePage.enterSearchQuery('Playwright');
    await homePage.submitSearchWithEnter();

    const resultsPage = new WikipediaSearchResultsPage(page);
    const refinedQuery = 'zxqv-no-wikipedia-page-9283746501';
    await expect(resultsPage.searchInput).toBeVisible();
    await resultsPage.searchInput.fill(refinedQuery);
    await resultsPage.searchInput.press('Enter');

    await expect.poll(() => new URL(page.url()).searchParams.get('search')).toBe(refinedQuery);
    await expect(resultsPage.body).toContainText(/There were no results matching the query/i);
  });

  test('unmatched search displays a no-results message', async ({ page }) => {
    const homePage = new WikipediaHomePage(page);
    const resultsPage = new WikipediaSearchResultsPage(page);
    await homePage.open();

    await homePage.enterSearchQuery('zxqv-no-wikipedia-page-9283746501');
    await homePage.submitSearchWithEnter();

    await expect(resultsPage.body).toContainText(/There were no results matching the query/i);
  });

  test('language selector works and search flows to selected language', async ({ page }) => {
    const homePage = new WikipediaHomePage(page);
    await homePage.open();

    await expect(homePage.languageDropdown).toBeVisible();

    const optionCount = await homePage.getLanguageOptionCount();
    expect(optionCount).toBeGreaterThan(0);

    await homePage.selectLanguage('Español');
    await expect(homePage.languageDropdown).toHaveValue('es');

    await homePage.enterSearchQuery('Playwright');
    await homePage.submitSearchWithEnter();

    await expect(page).toHaveURL(/es\.wikipedia\.org\//, { timeout: 20000 });
  });
});
