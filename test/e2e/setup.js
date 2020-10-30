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
  'browserstack.idleTimeout': 300
};

const startConfig = {
  'key': 'd9sxo4YepidkqDZHzStQ',
  'verbose': '3',
  'force': true,
  'forcelocal': true,
  'onlyAutomate': true,
  'proxyHost': 'forwardproxy-pr-build.lb.cumuli.be',
  'proxyPort': 3128,
  'daemon': true,
  'enable-utc-logging': true,
  'local-identifier': `${config.browserName}-browserstack-identifier`,
};

const buildBrowserstack = () => {
  return new browserstack.Local();
};

const buildDriver = () => {
  return new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub')
      .withCapabilities(capabilities)
      // .usingWebDriverProxy('http://forwardproxy-pr-build.lb.cumuli.be:3128') // proxy should be used but DIDM proxy has no support for websocket connections
      .build();
};

const bsLocal = buildBrowserstack();
const driver = buildDriver();

before((done) => {
  try {
    bsLocal.start(startConfig, () => {
      console.log('Starting Browserstack Local ...');
      done();
    });
  } catch (e) {
    console.log('Failed to setup Browserstack connection and configure driver. ' + e);
    bsLocal.stop(() => console.log('Stopping Browserstack Local ...'));
    done();
    process.exit();
  }
});

after((done) => {
  if (driver) {
    driver.quit().then(() => {
      if (bsLocal) {
        bsLocal.stop(() => {
          console.log('Stopping Browserstack Local ...');
          done();
        });
      } else {
        done();
      }
    });
  } else {
    done();
  }
});

module.exports = {assert, driver, By, Key};
