const axeBuilder = require('axe-webdriverjs');

class Page {
  constructor(driver) {
    this.driver = driver;
  }

  async load(url) {
    await this.driver.get(`${url}?no-header=true&no-footer=true`);
    await this.driver.manage().window().maximize();
  }

  async hasWcagIssues() {
    const report = await axeBuilder(this.driver).analyze();
    const violations = report.violations;
    if (violations && violations.length > 0) {
      violations.map((violation, index) => console.error(`WCAG issue ${++index}: ${violation.description}`));
      return true;
    } else {
      return false;
    }
  }
}

module.exports = Page;
