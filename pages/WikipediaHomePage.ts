import { type Locator, type Page } from '@playwright/test';

export class WikipediaHomePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly languageDropdown: Locator;
  readonly englishLink: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.locator('input[name="search"]').first();
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.languageDropdown = page.locator('#searchLanguage');
    this.englishLink = page.getByRole('link', { name: /^English\b/ });
  }

  async open(): Promise<void> {
    await this.page.goto('https://www.wikipedia.org/');
  }

  async enterSearchQuery(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async submitSearchWithEnter(): Promise<void> {
    await this.searchInput.press('Enter');
  }

  async submitSearchWithButton(): Promise<void> {
    await this.searchButton.click();
  }

  async selectLanguage(language: string): Promise<void> {
    await this.languageDropdown.selectOption({ label: language });
  }

  async getLanguageOptionCount(): Promise<number> {
    return this.languageDropdown.locator('option').count();
  }

  async openEnglishWikipedia(): Promise<void> {
    await this.englishLink.click();
  }
}