const {Builder, By, Key} = require('selenium-webdriver');
const config = require('./config');
let chrome = require('selenium-webdriver/chrome');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert;

process.env['webdriver.gecko.driver'] = '../../node_modules/geckodriver/geckodriver';
process.env['webdriver.chrome.driver'] = '../../node_modules/chromedriver/lib/chromedriver';

let driver;
let options = new chrome.Options();
options.addArguments(['start-maximized', 'disable-infobars', '--disable-extensions', '--no-sandbox', '--disable-dev-shm-usage']);

if (config.gridEnabled) {
  if(config.browserName == 'chrome') {
    driver = new Builder().usingServer(config.gridUrl).forBrowser('chrome').setChromeOptions(options).build();
  }
  driver = new Builder().usingServer(config.gridUrl).forBrowser(config.browserName).build();
} else {
  if(config.browserName == 'chrome') {
    driver = new Builder().usingServer(config.gridUrl).forBrowser('chrome').setChromeOptions(options).build();
  }
  driver = new Builder().forBrowser(config.browserName).build();
}

after(async () => {
  return driver.quit();
});

module.exports = {assert, driver, By, Key};
