import { test as base } from '@playwright/test';
import { BasePage } from '../pages/BasePage.js';
import { SpfRecordGeneratorPage } from '../pages/SpfRecordGeneratorPage.js';

export const test = base.extend({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },

  spfGeneratorPage: async ({ page }, use) => {
    const spfGeneratorPage = new SpfRecordGeneratorPage(page);
    await use(spfGeneratorPage);
  },
});

export { expect } from '@playwright/test';
