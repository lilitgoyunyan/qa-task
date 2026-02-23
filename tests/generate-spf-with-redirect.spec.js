import { test, expect } from '../fixtures/page-fixtures.js';
import {
  REDIRECT_VALUES,
  PLACEHOLDERS,
  SPF_OUTPUT,
} from '../test-data/spf-record-generator.data.js';

const REDIRECT_VALUE = REDIRECT_VALUES[0];

test.describe('SPF Record Generator', () => {
  test(`Generate SPF record with redirect to ${REDIRECT_VALUE}`, async ({ spfGeneratorPage }) => {
      //Navigate and verify page loaded
      await spfGeneratorPage.navigateToPage();
      await expect(spfGeneratorPage.domainInput, 'Domain input should be visible on page load').toBeVisible();
      await expect(spfGeneratorPage.generateButton, 'Generate button should be disabled before filling required fields').toBeDisabled();

      //Enter domain and verify it was filled
      const domain = await spfGeneratorPage.inputDomain();
      await expect(spfGeneratorPage.domainInput, 'Domain input should contain the entered domain value').toHaveValue(domain);

      //Enable redirect and verify toggle is checked
      await expect(spfGeneratorPage.redirectToggle, 'Redirect toggle should be unchecked by default').not.toBeChecked();
      await spfGeneratorPage.enableRedirect();
      await expect(spfGeneratorPage.redirectToggle, 'Redirect toggle should be checked after enabling').toBeChecked();

      //Verify redirect input is visible with correct placeholder
      await expect(spfGeneratorPage.redirectInput, 'Redirect input should be visible after enabling redirect').toBeVisible();
      await expect(spfGeneratorPage.redirectInput, 'Redirect input should show correct placeholder').toHaveAttribute('placeholder', PLACEHOLDERS.REDIRECT);

      //Fill redirect input and verify value
      await spfGeneratorPage.fillRedirectInput(REDIRECT_VALUE);
      await expect(spfGeneratorPage.redirectInput, `Redirect input should contain "${REDIRECT_VALUE}"`).toHaveValue(REDIRECT_VALUE);

      //Generate the SPF record
      await spfGeneratorPage.clickGenerate();

      //Assert generated output is visible
      await expect(spfGeneratorPage.generatedSpfRecord, 'Generated SPF record should be visible after clicking Generate').toBeVisible();

      //Assert SPF host output shows the entered domain
      await expect(spfGeneratorPage.spfHostOutput, 'SPF host output should be visible').toBeVisible();
      const spfHost = await spfGeneratorPage.getSpfHost();
      expect(spfHost, `SPF host should match the entered domain "${domain}"`).toBe(domain);

      //Assert generated record structure contains redirect
      const generatedOutput = await spfGeneratorPage.getGeneratedOutput();
      expect(generatedOutput, 'Generated record should start with v=spf1 prefix').toContain(SPF_OUTPUT.PREFIX);
      expect(generatedOutput, `Generated record should contain redirect=${REDIRECT_VALUE}`).toContain(`${SPF_OUTPUT.REDIRECT}${REDIRECT_VALUE}`);
      expect(generatedOutput, 'Generated record with redirect should not contain ~all').not.toContain(SPF_OUTPUT.SOFT_FAIL_ALL);
      expect(generatedOutput, 'Generated record with redirect should not contain -all').not.toContain(SPF_OUTPUT.FAIL_ALL);
    });
});
