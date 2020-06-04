class Page {
  constructor(driver) {
    this.driver = driver;
  }

  async load(url) {
    await this.driver.get(url);
    const header = await new VlHeader(driver);
    const footer = await new VlFooter(driver);
    await header.remove();
    await footer.remove();
  }
}

module.exports = Page;
