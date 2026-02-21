import { test, expect } from '../fixtures/page-fixtures.js';

test('Should navigate to SPF Generator page', async ({ basePage, page }) => {
  await basePage.navigateTo(process.env.SPF_GENERATOR_PATH);
  await expect(page).toHaveURL(new RegExp(process.env.SPF_GENERATOR_PATH));
});
