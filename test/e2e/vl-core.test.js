const {assert, getDriver} = require('./setup.js');
const VlCorePage = require('./pages/vl-core.page');

describe('vl-core', async () => {
  let driver;
  let vlCorePage;

  before(async () => {
    driver = getDriver();
    vlCorePage = new VlCorePage(driver);
    return vlCorePage.load();
  });

  it('een element wordt pas visible als het defined wordt', async () => {
    await vlCorePage.load();
    const slowElement = await vlCorePage.getSlowElement();
    await assert.eventually.isFalse(slowElement.isDisplayed());
    await driver.wait(async () => await slowElement.isDisplayed(), 3000);
  });
});
