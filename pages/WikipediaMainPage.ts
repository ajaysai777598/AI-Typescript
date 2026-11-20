import { type Locator, type Page } from '@playwright/test';

export class WikipediaMainPage {
  readonly appearancePanel: Locator;
  readonly largeFontOption: Locator;

  constructor(page: Page) {
    this.appearancePanel = page.locator('#content').getByRole('navigation', { name: 'Appearance' });
    this.largeFontOption = this.appearancePanel.getByRole('radio', { name: 'Large' });
  }

  async selectLargeAppearance(): Promise<void> {
    await this.largeFontOption.check();
  }
}