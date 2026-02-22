import { test, expect } from '../fixtures/page-fixtures.js';
import {
  INCLUDE_MECHANISMS,
  MECHANISM_TYPES,
  POLICY_OPTIONS,
  PLACEHOLDERS,
  SPF_OUTPUT,
} from '../test-data/spf-record-generator.data.js';

const INCLUDE_VALUE = INCLUDE_MECHANISMS[0];

test.describe('SPF Record Generator', () => {
  test('Generate SPF record with basic include and SoftFail policy', async ({ spfGeneratorPage }) => {
  //Navigate and verify page loaded
  await spfGeneratorPage.navigateToPage();
  await expect(spfGeneratorPage.domainInput, 'Domain input should be visible on page load').toBeVisible();
  await expect(spfGeneratorPage.domainInput, 'Domain input should show correct placeholder').toHaveAttribute('placeholder', PLACEHOLDERS.DOMAIN);
  await expect(spfGeneratorPage.generateButton, 'Generate button should be visible on page load').toBeVisible();
  await expect(spfGeneratorPage.generateButton, 'Generate button should be disabled before filling required fields').toBeDisabled();

  //Enter domain and verify it was filled
  const domain = await spfGeneratorPage.inputDomain();
  await expect(spfGeneratorPage.domainInput, 'Domain input should contain the entered domain value').toHaveValue(domain);

  //Ensure redirect is off
  await expect(spfGeneratorPage.redirectToggle, 'Redirect toggle should be unchecked').not.toBeChecked();

  //Click Show more and verify all mechanism options are visible
  await spfGeneratorPage.click(spfGeneratorPage.showMore);
  for (const type of MECHANISM_TYPES) {
    await expect(spfGeneratorPage.mechanismOption(type), `Mechanism option "${type}" should be visible after expanding`).toBeVisible();
  }

  //Add include value and verify it was entered
  await expect(spfGeneratorPage.mechanismInput('include'), 'Include input field should be visible').toBeVisible();
  await expect(spfGeneratorPage.mechanismInput('include'), 'Include input should show correct placeholder').toHaveAttribute('placeholder', PLACEHOLDERS.INCLUDE);
  await spfGeneratorPage.fillMechanismInput('include', INCLUDE_VALUE);
  await expect(spfGeneratorPage.mechanismInput('include'), `Include input should contain "${INCLUDE_VALUE}"`).toHaveValue(INCLUDE_VALUE);
  
  //Open failure policy dropdown and verify all options are visible
  await spfGeneratorPage.click(spfGeneratorPage.failurePolicyDropdown);
  for (const policy of Object.values(POLICY_OPTIONS)) {
    await expect(spfGeneratorPage.policyOption(policy), `${policy} policy option should be visible in dropdown`).toBeVisible();
  }

  //Select SoftFail policy and verify dropdown updated
  await spfGeneratorPage.click(spfGeneratorPage.policyOption(POLICY_OPTIONS.SOFT_FAIL));
  await expect(spfGeneratorPage.failurePolicyDropdown, 'Dropdown should display selected SoftFail policy').toContainText(POLICY_OPTIONS.SOFT_FAIL);

  //Generate the SPF record
  await spfGeneratorPage.clickGenerate();

  //Assert generated output is visible
  await expect(spfGeneratorPage.generatedSpfRecord, 'Generated SPF record should be visible after clicking Generate').toBeVisible();

  //Assert SPF host output shows the entered domain
  await expect(spfGeneratorPage.spfHostOutput, 'SPF host output should be visible').toBeVisible();
  const spfHost = await spfGeneratorPage.getSpfHost();
  expect(spfHost, `SPF host should match the entered domain "${domain}"`).toBe(domain);

  //Assert generated record structure
  const generatedOutput = await spfGeneratorPage.getGeneratedOutput();
  expect(generatedOutput, 'Generated record should start with v=spf1 prefix').toContain(SPF_OUTPUT.PREFIX);
  expect(generatedOutput, `Generated record should contain include:${INCLUDE_VALUE}`).toContain(`include:${INCLUDE_VALUE}`);
  expect(generatedOutput, 'Generated record should end with ~all for SoftFail policy').toContain(SPF_OUTPUT.SOFT_FAIL_ALL);
  expect(generatedOutput, 'Generated record should not contain redirect= when redirect is off').not.toContain(SPF_OUTPUT.REDIRECT);
  });
});
