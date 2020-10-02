const {By, Key, Builder} = require('selenium-webdriver');
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

async function startBrowserstackLocal(bsLocal) {
  return new Promise((resolve,reject) => {
    bsLocal = new browserstack.Local();
    bsLocal.start({'key': 'd9sxo4YepidkqDZHzStQ', 'verbose': true, 'force': true}, () => {
      if (bsLocal && bsLocal.isRunning()) {
        resolve();
      } else {
        reject(new Error('Failed to start Browserstack Local'));
      }
    });
  });
}

async function stopBrowserstackLocal(bsLocal) {
  return new Promise((resolve,reject) => {
    bsLocal.stop(() => {
      if (bsLocal && !bsLocal.isRunning()) {
        resolve();
      } else {
        reject(new Error('Failed to stop Browserstack Local'));
      }
    });
  });
}

async function buildDriver(driver) {
  return new Promise((resolve, reject) => {
    driver = new Builder().usingServer('https://hub-cloud.browserstack.com/wd/hub').withCapabilities(capabilities).build();
    if (driver) {
      resolve(driver);
    } else {
      reject(new Error('Failed to build webdriver!'));
    }
  });
}

let bsLocal;
let driver;

before(async () => {
  await startBrowserstackLocal(bsLocal);
  await buildDriver(driver);
});

after(async () => {
  await stopBrowserstackLocal(bsLocal);
  return driver.quit();
});

module.exports = { assert, driver, By, Key };
