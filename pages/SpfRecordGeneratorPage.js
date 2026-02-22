import { BasePage } from './BasePage.js';
import { generateRandomDomain } from '../utils/helpers.js';

export class SpfRecordGeneratorPage extends BasePage {
  constructor(page) {
    super(page);
    //Locators
    this.domainInput = page.locator('#domain');
    this.redirectToggle = page.locator('#redirect_check');
    this.failurePolicyDropdown = page.locator('#dropdownMenuButton');
    this.generateButton = page.locator('button[type="submit"].js-spf-generator-submit-form-btn');
    this.generatedSpfRecord = page.locator('#generated-spf-record');
    this.spfHostOutput = page.locator('#spf-host');
    this.agreeButton = page.getByRole('button', { name: 'Agree' });
    this.showMore = page.getByText('Show more');
    this.mechanismInput = (value) => page.locator(`input[data-name="${value}"]`);
    this.mechanismOption = (value) => page.locator(`[data-option="${value}"].mr-4`);
    this.policyOption = (value) => page.locator(`.js-dropdown-item[data-value="${value}"]`);
  }

  async navigateToPage() {
    await this.navigateTo(process.env.SPF_GENERATOR_PATH);
    await this.handleCookieConsent();
  }

  async handleCookieConsent() {
    const isVisible = await this.agreeButton.isVisible().catch(() => false);
    if (isVisible) {
      await this.agreeButton.click();
    }
    await this.page.evaluate(() => {
      document.querySelectorAll('section.cookie-consent, [class*="cookie-consent"]').forEach(el => el.remove());
    });
  }

  async inputDomain() {
    const domain = generateRandomDomain();
    await this.domainInput.waitFor({ state: 'visible' });
    await this.domainInput.clear();
    await this.domainInput.pressSequentially(domain);
    return domain;
  }

  async ensureRedirectIsOff() {
    const isChecked = await this.redirectToggle.isChecked();
    if (isChecked) {
      await this.click(this.redirectToggle);
    }
  }

  async fillMechanismInput(name, value) {
    const input = this.mechanismInput(name).last();
    await input.waitFor({ state: 'visible' });
    await input.clear();
    await input.pressSequentially(value);
  }

  async clickGenerate() {
    await this.generateButton.click();
    await this.generatedSpfRecord.waitFor({ state: 'visible' });
    await this.generatedSpfRecord.evaluate(el => el.scrollIntoView({ block: 'center' }));
  }

  async getGeneratedOutput() {
    return await this.getText(this.generatedSpfRecord);
  }

  async getSpfHost() {
    return await this.getText(this.spfHostOutput);
  }
}