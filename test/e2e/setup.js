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
};

async function startBrowserstackLocal(bsLocal) {
  return new Promise((resolve,reject) => {
    bsLocal = new browserstack.Local();
    bsLocal.start({'key': 'd9sxo4YepidkqDZHzStQ', 'verbose': true, 'force': true, 'only-automate': true, 'proxyHost': 'forwardproxy-pr-build.lb.cumuli.be', 'proxyPort': 3128}, () => {
      console.log('Starting Browserstack Local ...');
      if (bsLocal && bsLocal.isRunning()) {
        console.log('Browserstack Local started successfully!');
        console.log('Browserstack binary: ' + bsLocal);
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
      console.log('Stopping Browserstack Local ...');
      if (bsLocal && !bsLocal.isRunning()) {
        console.log('Browserstack Local stopped successfully!');
        resolve();
      } else {
        reject(new Error('Failed to stop Browserstack Local'));
      }
    });
  });
}

async function buildDriver(driver) {
  return new Promise((resolve, reject) => {
    console.log('Building driver ...');
    driver = new Builder().usingServer('https://hub-cloud.browserstack.com/wd/hub').withCapabilities(capabilities).build();
    if (driver) {
      console.log('Driver built successfully!');
      console.log('Driver: ' + driver);
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
  if (bsLocal) {
    await stopBrowserstackLocal(bsLocal);
  }
  return driver.quit();
});

module.exports = { assert, driver, By, Key };
