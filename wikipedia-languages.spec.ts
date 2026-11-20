import { test, expect } from './fixtures/test';
import { WikipediaLanguageApi } from './api/WikipediaLanguageApi';
import { WikipediaHomePage } from './pages/WikipediaHomePage';
import { WikipediaSearchResultsPage } from './pages/WikipediaSearchResultsPage';

test.describe('Wikipedia languages', () => {
  test('returns active Wikipedia languages with unique codes', async ({ request }) => {
    const wikipediaLanguageApi = new WikipediaLanguageApi(request);
    const languages = await wikipediaLanguageApi.getActiveLanguages();

    expect(languages.length).toBeGreaterThan(0);

    const languageCodes = languages.map((language) => language.code);
    expect(languageCodes).toContain('en');
    expect(languageCodes).toContain('es');
    expect(new Set(languageCodes).size).toBe(languageCodes.length);
    expect(languages.map((language) => language.englishName)).toEqual(
      [...languages.map((language) => language.englishName)].sort((first, second) =>
        first.localeCompare(second),
      ),
    );
  });

  test('selects Spanish and searches on Spanish Wikipedia', async ({ page }) => {
    const homePage = new WikipediaHomePage(page);
    const resultsPage = new WikipediaSearchResultsPage(page);

    await homePage.open();
    await expect(homePage.languageDropdown).toBeVisible();

    await homePage.selectLanguage('Español');
    await expect(homePage.languageDropdown).toHaveValue('es');

    await homePage.enterSearchQuery('Cricket');
    await homePage.submitSearchWithEnter();

    await resultsPage.waitForLanguage('es');
    await expect(resultsPage.body).toContainText(/Cricket|críquet/i);
  });
});
