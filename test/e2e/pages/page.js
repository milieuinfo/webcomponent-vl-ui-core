module.exports = class Page {
    constructor(driver) {
        this.driver = driver;
    }

    async load(url) {
        await this.driver.get(url);
    }
}
