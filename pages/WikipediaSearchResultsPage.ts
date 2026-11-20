import { type Locator, type Page } from '@playwright/test';

export class WikipediaSearchResultsPage {
  readonly searchInput: Locator;
  readonly body: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.locator('input[name="search"]').first();
    this.body = page.locator('body');
  }

  async waitForLanguage(languageCode: string): Promise<void> {
    await this.page.waitForURL((url) => url.hostname === `${languageCode}.wikipedia.org`);
  }
}