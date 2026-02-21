export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigateTo(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async click(locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fill(locator, text) {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(text);
  }

  async check(locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.check();
  }

  async uncheck(locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.uncheck();
  }

  async hover(locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.hover();
  }

  async scrollIntoView(locator) {
    await locator.waitFor({ state: 'attached' });
    await locator.scrollIntoViewIfNeeded();
  }

  async getText(locator) {
    await locator.waitFor({ state: 'visible' });
    return locator.innerText();
  }

  async selectOption(locator, value) {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }
}