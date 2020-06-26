const yargs = require('yargs').argv;

function browserName() {
  if (process.argv || yargs) {
    if (process.argv.includes('chrome') || yargs.chrome) {
      return 'chrome';
    } else if (process.argv.includes('firefox') || yargs.firefox) {
      return 'firefox';
    } else if (process.argv.includes('opera') || yargs.opera) {
      return 'opera';
    } else if (process.argv.includes('safari') || yargs.safari) {
      return 'safari';
    } else {
      console.warn('Geen geldige browser gevonden, default Chrome browser!');
      return 'chrome';
    }
  }
}

function gridEnabled() {
  return process.argv.includes('grid') || yargs.grid;
}

module.exports = {
  browserName: browserName(),
  gridEnabled: gridEnabled(),
  gridUrl: 'https://philippecambien2:d9sxo4YepidkqDZHzStQ@hub-cloud.browserstack.com/wd/hub',
  baseUrl: gridEnabled() ? 'http://localhost:8080' : 'http://localhost:8080',
};
