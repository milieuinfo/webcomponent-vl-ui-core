const { assert, driver } = require('./test.js');
const { Page } = require('./pages/page.js');
const { VlElement } = require('./components/vl-element.js');
const { config } = require('./config.js')
module.exports = { assert, driver, Page, VlElement, config };
