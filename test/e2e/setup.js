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
    bsLocal.start({'key': 'd9sxo4YepidkqDZHzStQ', 'verbose': true, 'force': true, 'force-local': true, 'only-automate': true, 'proxyHost': 'forwardproxy-pr-build.lb.cumuli.be', 'proxyPort': 3128}, () => {
      console.log('Starting Browserstack Local ...');
      if (bsLocal && bsLocal.isRunning()) {
        resolve();
      } else {
        reject(new Error('Failed to start Browserstack Local. bslocal: ' + bsLocal));
      }
    });
  }).catch(console.log);
}

async function stopBrowserstackLocal(bsLocal) {
  return new Promise((resolve,reject) => {
    bsLocal.stop(() => {
      console.log('Stopping Browserstack Local ...');
      if (bsLocal && !bsLocal.isRunning()) {
        resolve();
      } else {
        reject(new Error('Failed to stop Browserstack Local'));
      }
    });
  }).catch(console.log);
}

async function buildDriver(driver) {
  return new Promise((resolve, reject) => {
    driver = new Builder().usingServer('https://hub-cloud.browserstack.com/wd/hub').withCapabilities(capabilities).build();
    if (driver) {
      resolve(driver);
    } else {
      reject(new Error('Failed to build webdriver!'));
    }
  }).catch(console.log);
}

let bsLocal;
let driver;

before(async () => {
  try {
    await startBrowserstackLocal(bsLocal);
    await buildDriver(driver);
    console.log('Setup done!');
    console.log('Using Browserstack: ' + bsLocal.isRunning());
    const session = await driver.getSession();
    console.log('Driver session: ' + session);
  } catch (e) {
    console.log('Failed to setup Browserstack connection and configure driver. ' + e );
    process.exit();
  }
});

after(async () => {
  if (bsLocal) {
    await stopBrowserstackLocal(bsLocal);
  }
  if (driver) {
    return driver.quit();
  }
});

module.exports = { assert, driver, By, Key };
