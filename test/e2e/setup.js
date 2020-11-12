const {By, Key, Builder} = require('selenium-webdriver');
const browserstack = require('browserstack-local');
const config = require('./config');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert;

const capabilities = {
  'resolution': '1920x1080',
  'os': config.osName,
  'os_version': config.osVersion,
  'browserName': config.browserName,
  'browser_version': 'latest',
  'name': 'Webcomponenten',
  'build': 'Milieuinfo',
  'browserstack.user': 'philippecambien2',
  'browserstack.key': 'd9sxo4YepidkqDZHzStQ',
  'browserstack.local': true,
  'browserstack.networkLogs': true,
  'browserstack.idleTimeout': 300,
  'browserstack.localIdentifier': `${config.browserName}-browserstack-identifier`,
};

const startConfig = {
  'key': 'd9sxo4YepidkqDZHzStQ',
  'force': true,
  'deamon': true,
  'disableProxyDiscovery': true,
  'localIdentifier': `${config.browserName}-browserstack-identifier`,
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
            // .usingWebDriverProxy('http://forwardproxy-pr-build.lb.cumuli.be:3128') // proxy should be used but DIDM proxy has no support for websocket connections
            .build();
        done();
      });
    } catch (e) {
      bsLocal.stop(() => {
        done();
        process.exit();
      });
    }
  } else {
    driver = new Builder().forBrowser(config.browserName).build();
    done();
  }
});

after((done) => {
  if (bsLocal) {
    bsLocal.stop(() => {
      if (driver) {
        driver.quit().then(() => done());
      }
    });
  } else {
    driver.quit().then(() => done());
  }
});

module.exports = {assert, getDriver, By, Key};
