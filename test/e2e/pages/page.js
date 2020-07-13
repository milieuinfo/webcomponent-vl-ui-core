class Page {
  constructor(driver) {
    this.driver = driver;
  }

  async load(url) {
    await this.driver.get(`${url}?no-header=true&no-footer=true`);
    await this.driver.manage().window().maximize();
  }
}

module.exports = Page;
