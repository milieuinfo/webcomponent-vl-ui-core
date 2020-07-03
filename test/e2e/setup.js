const {Builder, By, Key} = require('selenium-webdriver');
const config = require('./config');
const browserstack = require('browserstack-local');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert;

process.env['webdriver.gecko.driver'] = '../../node_modules/geckodriver/geckodriver';
process.env['webdriver.chrome.driver'] = '../../node_modules/chromedriver/lib/chromedriver';

let driver;
let bs;

(async () => {
  const capabilities = {
    'browserName': 'chrome',
    'browserstack.local': 'true',
    'name': 'POC'
  };
  const setup = new Promise((resolve, reject) => {
    bs = new browserstack.Local();
    const args = {
      'key': 'd9sxo4YepidkqDZHzStQ',
      'proxyHost': 'forwardproxy-pr-build.lb.cumuli.be',
      'proxyPort': '3128',
      'forceLocal': true,
      'verbose': true
    };

    bs.start(args, function(error) {
      console.log('Starting Browserstack local ...');
      if (error) {
        reject(error);
      }
    });

    if (config.gridEnabled) {
      driver = new Builder().usingServer(config.gridUrl).usingWebDriverProxy('https://forwardproxy-pr-build.lb.cumuli.be:3128').withCapabilities(capabilities).build();
    } else {
      driver = new Builder().forBrowser(config.browserName).build();
    }
    resolve(driver);
  });

  driver = await setup;
})();

after(async () => {
  bs.stop(function() {
    console.log('Stopped BrowserStackLocal');
  });

  return driver.quit();
});


module.exports = { assert, driver, By, Key };
