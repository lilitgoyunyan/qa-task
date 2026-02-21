import { test, expect } from '@playwright/test';

test('Should navigate to SPF Generator page', async ({ page }) => {
  await page.goto(process.env.SPF_GENERATOR_PATH);
  await expect(page).toHaveURL(new RegExp(process.env.SPF_GENERATOR_PATH));
});
