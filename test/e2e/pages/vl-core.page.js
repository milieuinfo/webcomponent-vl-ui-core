const {Page, Config} = require('vl-ui-core').Test;
const {By} = require('vl-ui-core').Test.Setup;

class VlCorePage extends Page {
  async getSlowElement() {
    return this.driver.findElement(By.css('#slow-element'));
  }

  async load() {
    await super.load(Config.baseUrl + '/demo/vl-core.html');
  }
};

module.exports = VlCorePage;


