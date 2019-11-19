const { Builder } = require('selenium-webdriver');
const config = require('./config');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var assert = chai.assert;

process.env['webdriver.gecko.driver'] = "../../node_modules/geckodriver/geckodriver";
process.env['webdriver.chrome.driver'] = "../../node_modules/chromedriver/lib/chromedriver"

let driver;

if (config.gridEnabled) {
    config.baseUrl = "http://tests:8080/demo/vl-button.html";
    driver = new Builder().usingServer(config.gridUrl).forBrowser(config.browserName).build();
} else {
    config.baseUrl = "http://localhost:8080/demo/vl-button.html";
    driver = new Builder().forBrowser(config.browserName).build(); 
}

module.exports = { assert, driver };
