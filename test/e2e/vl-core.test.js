const {assert, getDriver} = require('vl-ui-core').Test.Setup;
const VlCorePage = require('./pages/vl-core.page');

describe('vl-core', async () => {
  let driver;
  let vlCorePage;

  before(() => {
    driver = getDriver();
    vlCorePage = new VlCorePage(driver);
    return vlCorePage.load();
  });

  it('een element wordt pas visible als het defined wordt', async () => {
    const slowElement = await vlCorePage.getSlowElement();
    await assert.eventually.isFalse(slowElement.isDisplayed());
    await driver.wait(async () => await slowElement.isDisplayed(), 3000);
  });
});
