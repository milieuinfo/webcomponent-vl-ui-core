class Page {
  constructor(driver) {
    this.driver = driver;
  }

  async load(url) {
    await this.driver.get(`${url}?no-header=true&no-footer=true`);
    await this.driver.manage().window().maximize();
    const body = await this.driver.findElement(By.css('body'));
    await this.driver.wait(until.elementIsVisible(body), 5000);
  }
}

module.exports = Page;
