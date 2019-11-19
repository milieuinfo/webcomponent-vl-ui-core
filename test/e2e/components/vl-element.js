const { WebElement } = require('selenium-webdriver');
const { By } = require('selenium-webdriver');

class VlElement extends WebElement {
    constructor(driver, selector) {
        return (async () => {
            super(driver, await driver.findElement(By.css(selector)).getId());
            this.driver = driver;
            this.selector = selector;
            return this;
        })();
    }

    async getClassList() {
        return (await this.getAttribute('class')).split(' ');
    }

    async isDisabled() {
        return !(await this.isEnabled());
    }

    async hasClass(clazz) {
        return (await this.getClassList()).includes(clazz);
    }

    async hasAttribute(name) {
        return (await super.getAttribute(name)) != null;
    }

    async hasText() {
        return (await this.getText()) != '';
    }
}

module.exports = VlElement;
