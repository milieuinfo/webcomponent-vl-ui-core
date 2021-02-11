const {By, Key, Builder} = require('selenium-webdriver');
const browserstack = require('browserstack-local');
const config = require('./config');

let packagejson;
try {
  packagejson = require('../../../../package.json');
} catch (e) {
  packagejson = require('../../package.json');
}

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert;
const identifier = `${packagejson.name}-${config.browserName}-browserstack-identifier`;

const capabilities = {
  'resolution': '1920x1080',
  'os': config.osName,
  'os_version': config.osVersion,
  'browserName': config.browserName,
  'browser_version': config.browserVersion,
  'name': packagejson.name,
  'build': 'Webcomponenten',
  'browserstack.user': process.env.browserstack_username,
  'browserstack.key': process.env.browserstack_password,
  'browserstack.local': true,
  'browserstack.localIdentifier': identifier,
  'browserstack.selenium_version': '4.0.0-alpha-6',
  'browserstack.idleTimeout': '3000',
  'browserstack.SO_TIMEOUT': '3000',
};

const startConfig = {
  'key': process.env.browserstack_password,
  'force': true,
  'forcelocal': true,
  'proxyHost': 'forwardproxy-pr-build.lb.cumuli.be',
  'proxyPort': 3128,
  'localIdentifier': identifier,
};

let bsLocal;
let driver;

const getDriver = () => {
  return driver;
};

before((done) => {
  if (config.browserstack) {
    bsLocal = new browserstack.Local();
    try {
      bsLocal.start(startConfig, () => {
        driver = new Builder()
            .usingServer('https://hub-cloud.browserstack.com/wd/hub')
            .withCapabilities(capabilities)
            // .usingWebDriverProxy('http://forwardproxy-pr-build.lb.cumuli.be:3128')
            .build();
        done();
      });
    } catch (e) {
      console.log(e);
      process.exit();
    }
  } else {
    driver = new Builder().forBrowser(config.browserName).build();
    done();
  }
});

after((done) => {
  try {
    if (driver) {
      driver.close().then(() => {
        driver.quit().then(() => {
          if (bsLocal) {
            bsLocal.stop(() => done());
          } else {
            done();
          }
        });
      });
    } else {
      done();
    }
  } catch (e) {
    console.log(e);
    process.exit();
  }
});

module.exports = {assert, getDriver, By, Key};
