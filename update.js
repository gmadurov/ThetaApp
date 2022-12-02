
// load the app.json file and change the expo.ios.buildNumber value
const fs = require('fs');
const package = require('./package.json');
const appJson = require('./app.json');
appJson.expo.version = package.version;
appJson.expo.ios.buildNumber = (parseInt(appJson.expo.ios.buildNumber) + 1).toString();
fs.writeFileSync('./app.json', JSON.stringify(appJson, null, 2));