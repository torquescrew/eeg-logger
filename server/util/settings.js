var fs = require('fs');
var path = require('path');

var settingsPath = path.resolve(__dirname + '/../../app-state/state.json');
console.log(settingsPath);

function saveSettings(settings) {
   var settingsStr = JSON.stringify(settings);

   fs.writeFile(settingsPath, settingsStr, function(err) {
      if (err) throw err;
      console.log('saved settings');
   })
}

function loadSettings(callback) {
   fs.readFile(settingsPath, function(err, settings) {
      if (err) {
         console.log(settingsPath + " doesn't exist");
         if (callback) {
            callback({});
         }
      }
      else if (callback) {
         callback(JSON.parse(settings));
      }
   });
}

module.exports.saveSettings = saveSettings;
module.exports.loadSettings = loadSettings;