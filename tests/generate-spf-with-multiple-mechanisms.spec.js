import { test, expect } from '../fixtures/page-fixtures.js';
import {
  INCLUDE_MECHANISMS,
  MECHANISM_TYPES,
  POLICY_OPTIONS,
  PLACEHOLDERS,
  MECHANISM_VALUES,
  SPF_OUTPUT,
} from '../test-data/spf-record-generator.data.js';

const INCLUDE_VALUE = INCLUDE_MECHANISMS[0];
const SECOND_INCLUDE_VALUE = INCLUDE_MECHANISMS[1];

test.describe('SPF Record Generator', () => {
  test('Generate SPF record with multiple mechanisms and Fail policy', async ({ spfGeneratorPage }) => {
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
  
  //Add a second include value
  await spfGeneratorPage.click(spfGeneratorPage.mechanismOption('include'));
  await expect(spfGeneratorPage.mechanismInput('include').last(), 'Second include input should show correct placeholder').toHaveAttribute('placeholder', PLACEHOLDERS.INCLUDE);
  await spfGeneratorPage.fillMechanismInput('include', SECOND_INCLUDE_VALUE);

  //Add an A record and fill it
  await spfGeneratorPage.click(spfGeneratorPage.mechanismOption('a'));
  await expect(spfGeneratorPage.mechanismInput('a'), 'A record input should be visible after clicking A option').toBeVisible();
  await expect(spfGeneratorPage.mechanismInput('a'), 'A record input should show correct placeholder').toHaveAttribute('placeholder', PLACEHOLDERS.A_RECORD);
  await spfGeneratorPage.fillMechanismInput('a', MECHANISM_VALUES.A);

  //Add an MX record and fill it
  await spfGeneratorPage.click(spfGeneratorPage.mechanismOption('mx'));
  await expect(spfGeneratorPage.mechanismInput('mx'), 'MX record input should be visible after clicking MX option').toBeVisible();
  await spfGeneratorPage.fillMechanismInput('mx', MECHANISM_VALUES.MX);

  //Add an Exists record and fill it
  await spfGeneratorPage.click(spfGeneratorPage.mechanismOption('exists'));
  await expect(spfGeneratorPage.mechanismInput('exists'), 'Exists record input should be visible after clicking Exists option').toBeVisible();
  await spfGeneratorPage.fillMechanismInput('exists', MECHANISM_VALUES.EXISTS);

  //Open failure policy dropdown and verify all options are visible
  await spfGeneratorPage.click(spfGeneratorPage.failurePolicyDropdown);
  for (const policy of Object.values(POLICY_OPTIONS)) {
    await expect(spfGeneratorPage.policyOption(policy), `${policy} policy option should be visible in dropdown`).toBeVisible();
  }

  //Select Fail policy and verify dropdown updated
  await spfGeneratorPage.click(spfGeneratorPage.policyOption(POLICY_OPTIONS.FAIL));
  await expect(spfGeneratorPage.failurePolicyDropdown, 'Dropdown should display selected Fail policy').toContainText(POLICY_OPTIONS.FAIL);

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
  expect(generatedOutput, `Generated record should contain include:${SECOND_INCLUDE_VALUE}`).toContain(`include:${SECOND_INCLUDE_VALUE}`);
  expect(generatedOutput, `Generated record should contain include:${INCLUDE_VALUE}`).toContain(`include:${INCLUDE_VALUE}`);
  expect(generatedOutput, `Generated record should contain a:${MECHANISM_VALUES.A}`).toContain(`a:${MECHANISM_VALUES.A}`);
  expect(generatedOutput, `Generated record should contain mx:${MECHANISM_VALUES.MX}`).toContain(`mx:${MECHANISM_VALUES.MX}`);
  expect(generatedOutput, `Generated record should contain exists:${MECHANISM_VALUES.EXISTS}`).toContain(`exists:${MECHANISM_VALUES.EXISTS}`);
  expect(generatedOutput, 'Generated record should end with -all for Fail policy').toContain(SPF_OUTPUT.FAIL_ALL);
  expect(generatedOutput, 'Generated record should not contain redirect= when redirect is off').not.toContain(SPF_OUTPUT.REDIRECT);
  });
});
