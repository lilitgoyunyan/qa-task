import { test as base } from '@playwright/test';
import { BasePage } from '../pages/BasePage.js';

export const test = base.extend({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },
});

export { expect } from '@playwright/test';
