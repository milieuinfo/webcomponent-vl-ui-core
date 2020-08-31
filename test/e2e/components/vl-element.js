const {WebElement, By} = require('selenium-webdriver');

class VlElement extends WebElement {
  constructor(driver, identifier, mixins) {
    return (async () => {
      if (typeof identifier === 'string') {
        super(driver, await driver.findElement(By.css(identifier)).getId());
        this.selector = identifier;
      } else {
        super(driver, await identifier.getId());
      }
      this.driver = driver;
      if (await this.driver.executeScript('return arguments[0].shadowRoot != undefined', this)) {
        this.shadowRoot = await new VlElement(this.driver, await this.driver.executeScript('return arguments[0].shadowRoot.lastElementChild', this));
      }
      if (mixins && Array.isArray(mixins)) {
        mixins.forEach((mixin) => Object.assign(this, mixin));
      }
      return this;
    })();
  }

  async findElement(selector) {
    const element = await super.findElement(selector);
    return await new VlElement(this.driver, element);
  }

  async getClassList() {
    return (await this.getAttribute('class')).split(' ');
  }

  async getText() {
    let text;
    if ((await this.hasAssignedSlot())) {
      text = await this.getTextContent();
    } else {
      text = await super.getText();
    }
    return text.trim();
  }

  async getTextContent() {
    return this.getAttribute('textContent');
  }

  async isDisabled() {
    return !(await this.isEnabled());
  }

  async hasClass(clazz) {
    return (await this.getClassList()).includes(clazz);
  }

  async hasAttribute(name) {
    return (await this.getAttribute(name)) != null;
  }

  async hasText() {
    return (await this.getText()) !== '';
  }

  async getInnerHTML() {
    return this.getAttribute('innerHTML');
  }

  async hasFocus() {
    const rootActiveElement = await this._getActiveElement(await new VlElement(this.driver, this.driver.switchTo().activeElement()));
    const activeElement = await this._getActiveElement(this);

    if (activeElement && rootActiveElement) {
      return WebElement.equals(activeElement, rootActiveElement);
    } else {
      return false;
    }
  }

  async hasAssignedSlot() {
    return (this.driver.executeScript('return arguments[0].assignedSlot != undefined', this));
  }

  async hover() {
    const actions = this.driver.actions();
    await this.scrollIntoView();
    return actions.move({origin: this}).perform();
  }

  async getAssignedElements(slot) {
    return this.driver.executeScript(
        'return arguments[0].assignedElements()', slot);
  }

  async getAssignedNodes(slot) {
    return this.driver.executeScript(
        'return arguments[0].assignedNodes()', slot);
  }

  async scrollIntoView() {
    return this.driver.executeScript('return arguments[0].scrollIntoView()', this);
  }

  async isInViewport() {
    const bounding = await this.driver.executeScript('return arguments[0].getBoundingClientRect()', this);
    const height = await this.driver.executeScript('return (window.innerHeight || document.documentElement.clientHeight)');
    const width = await this.driver.executeScript('return (window.innerWidth || document.documentElement.clientWidth)');
    const outOfViewport = {
      top: bounding.top < 0,
      left: bounding.left < 0,
      bottom: bounding.bottom > height,
      right: bounding.right > width,
    };
    return !outOfViewport.top && !outOfViewport.left && !outOfViewport.bottom && !outOfViewport.right;
  }

  async scrollToTop() {
    return this.driver.executeScript('return arguments[0].scrollTop = 0;', this);
  }

  async parent() {
    const element = await this.findElement(By.xpath('..'));
    return new VlElement(this.driver, element);
  }

  async equals(element) {
    return WebElement.equals(this, element);
  }

  async getAttribute(attribute) {
    const result = await super.getAttribute(attribute);
    if (result != undefined) {
      return result;
    } else {
      return super.getAttribute(this._attributePrefix + attribute);
    }
  }

  get _attributePrefix() {
    return 'data-vl-';
  }

  async _getActiveElement(element) {
    if (element.shadowRoot) {
      return this._findActiveElementInShadowRoot(element);
    } else {
      return element;
    }
  }

  async _findActiveElementInShadowRoot(element) {
    const activeElement = await (this.driver.executeScript('return arguments[0].shadowRoot.activeElement', element));
    if (activeElement) {
      return this._getActiveElement(await new VlElement(this.driver, activeElement));
    } else {
      return null;
    }
  }
}

module.exports = VlElement;
