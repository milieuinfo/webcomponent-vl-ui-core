const yargs = require('yargs').argv;

const macOS = 'OS X';
const windows = 'Windows';

const macOsVersion = 'Catalina';
const windowsVersion = '10';

const chrome = 'chrome';
const firefox = 'firefox';
const edge = 'edge';
const safari = 'safari';
const opera = 'opera';

const browserName = () => {
  if (process.argv || yargs) {
    if (process.argv.includes(chrome) || yargs.chrome) {
      return chrome;
    } else if (process.argv.includes(firefox) || yargs.firefox) {
      return firefox;
    } else if (process.argv.includes(edge) || yargs.edge) {
      return edge;
    } else if (process.argv.includes(safari) || yargs.safari) {
      return safari;
    } else if (process.argv.includes(opera) || yargs.opera) {
      return opera;
    } else {
      console.warn('Geen geldige browser gevonden, default Chrome browser!');
      return chrome;
    }
  }
};

const osName = () => {
  switch (browserName()) {
    case safari:
      return macOS;
    default:
      return windows;
  }
};

const osVersion = () => {
  switch (osName()) {
    case macOS:
      return macOsVersion;
    default:
      return windowsVersion;
  }
};

module.exports = {
  browserName: browserName(),
  osName: osName(),
  osVersion: osVersion(),
  gridUrl: 'http://selenium-hub:4444/wd/hub',
  baseUrl: 'http://localhost:8080',
};
