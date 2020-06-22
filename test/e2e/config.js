function browserName() {
  if (process.argv) {
    if (process.argv.includes('chrome')) {
      return 'chrome';
    } else if (process.argv.includes('firefox')) {
      return 'firefox';
    } else if (process.argv.includes('opera')) {
      return 'opera';
    } else if (process.argv.includes('safari')) {
      return 'safari';
    } else {
      console.warn('Geen geldige browser gevonden, default Chrome browser!');
      return 'chrome';
    }
  }
}

function gridEnabled() {
  return process.argv.includes('grid');
}

module.exports = {
  browserName: browserName(),
  gridEnabled: gridEnabled(),
  gridUrl: 'http://selenium-hub:4444/wd/hub',
  baseUrl: gridEnabled() ? 'http://tests:8080' : 'http://localhost:8080',
};
