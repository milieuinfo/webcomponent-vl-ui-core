const {By, Key, webdriver} = require('selenium-webdriver');
const browserstack = require('browserstack-local');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert;

const capabilities = {
  'os_version': '10',
  'resolution': '1920x1080',
  'browser': 'Chrome',
  'browser_version': 'latest',
  'os': 'Windows',
  'name': 'Webcomponenten',
  'build': 'Milieuinfo',
  'browserstack.user': 'philippecambien2',
  'browserstack.key': 'd9sxo4YepidkqDZHzStQ',
};

let bsLocal;
const driver = new webdriver.Builder().usingServer('https://hub-cloud.browserstack.com/wd/hub').withCapabilities(capabilities).build();

before(() => {
  bsLocal = new browserstack.Local();
  bsLocal.start({'key': 'd9sxo4YepidkqDZHzStQ', 'verbose': true, 'force': true}, () => {
    console.log('Is browserstack Local running?: ' + bsLocal.isRunning());
  });
});

after(() => {
  bsLocal.stop(() => {
    console.log('Is browserstack Local successfully stopped?: ' + bsLocal.isRunning());
  });
  return driver.quit();
});

module.exports = { assert, driver, By, Key };
