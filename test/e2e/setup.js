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

const capabilities = {
  'os': 'Windows',
  'os_version': '10',
  'browserName': 'Chrome',
  'browser_version': '80',
  'browserstack.local': 'true',
  'acceptSslCerts': 'true',
  'name': 'POC'
};

const bs = new browserstack.Local();
const args = {'key': 'd9sxo4YepidkqDZHzStQ',
  'localProxyHost': 'forwardproxy-pr-build.lb.cumuli.be',
  'localProxyPort': '3128',
  'forceLocal': true,
  'force': true,
  'logfile': 'log.txt',
  'verbose': true
}

bs.start(args, function(error) {
  if (error) {
    console.log(error);
  }
  console.log('Started browserstack local');
});

if (config.gridEnabled) {
  driver = new Builder().usingServer(config.gridUrl).withCapabilities(capabilities).build();
} else {
  driver = new Builder().forBrowser(config.browserName).build();
}

after(async () => {

  bs.stop(function() {
    console.log('Stopped BrowserStackLocal');
  });

  return driver.quit();
});

module.exports = { assert, driver, By, Key };
