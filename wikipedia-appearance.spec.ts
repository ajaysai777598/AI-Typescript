import { test, expect } from './fixtures/test';
import { WikipediaHomePage } from './pages/WikipediaHomePage';
import { WikipediaMainPage } from './pages/WikipediaMainPage';

test('opens English Wikipedia and selects large appearance', async ({ page }) => {
    const homePage = new WikipediaHomePage(page);
    await homePage.open();

    await homePage.openEnglishWikipedia();
    await expect(page).toHaveURL(/en\.wikipedia\.org\/wiki\/Main_Page/);

    const mainPage = new WikipediaMainPage(page);
    await expect(mainPage.appearancePanel).toBeVisible();
    await mainPage.selectLargeAppearance();

    await expect(mainPage.largeFontOption).toBeChecked();
});

test('counts search languages and selects Español', async ({ page }) => {
    const homePage = new WikipediaHomePage(page);
    await homePage.open();

    const languageCount = await homePage.getLanguageOptionCount();

    console.log(`Languages available in the search dropdown: ${languageCount}`);
    expect(languageCount).toBeGreaterThan(0);

    await homePage.selectLanguage('Español');
    await expect(homePage.languageDropdown).toHaveValue('es');
});
