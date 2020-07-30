const {assert, driver} = require('vl-ui-core').Test.Setup;
const VlCorePage = require('./pages/vl-core.page');

describe('vl-core', async () => {
  const vlCorePage = new VlCorePage(driver);

  before(() => {
    return vlCorePage.load();
  });

  it('Een element wordt pas visible als het defined wordt', async () => {
    const slowElement = await vlCorePage.getSlowElement();
    await assert.eventually.isFalse(slowElement.isDisplayed());
    await driver.wait(async () => await slowElement.isDisplayed(), 3000);
  });
});
