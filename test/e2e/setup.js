const {By, Key, Builder} = require('selenium-webdriver');
const browserstack = require('browserstack-local');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert;

const capabilities = {
  'os_version': '10',
  'resolution': '1920x1080',
  'browserName': 'Chrome',
  'browser_version': 'latest',
  'os': 'Windows',
  'name': 'Webcomponenten',
  'build': 'Milieuinfo',
  'browserstack.user': 'philippecambien2',
  'browserstack.key': 'd9sxo4YepidkqDZHzStQ',
  'browserstack.local': true,
};

const startConfig = {
  'key': 'd9sxo4YepidkqDZHzStQ',
  'verbose': true,
  'force': true,
  'force-local': true,
  'only-automate': true,
  'proxyHost': 'forwardproxy-pr-build.lb.cumuli.be',
  'proxyPort': 3128,
};

const buildBrowserstack = () => {
  return new browserstack.Local();
};

const buildDriver = () => {
  return new Builder().usingServer('https://hub-cloud.browserstack.com/wd/hub').withCapabilities(capabilities).build();
};

const bsLocal = buildBrowserstack();
const driver = buildDriver();

before(async () => {
  try {
    bsLocal.start(startConfig, () => console.log('Starting Browserstack Local ...'));
  } catch (e) {
    console.log('Failed to setup Browserstack connection and configure driver. ' + e);
    bsLocal.stop();
    stopBrowserstackLocal(bsLocal);
    process.exit();
  }
});

after(async () => {
  if (bsLocal) {
    bsLocal.stop();
  }
  if (driver) {
    return driver.quit();
  }
});

module.exports = {assert, driver, By, Key};
