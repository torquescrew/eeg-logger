var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var debugSettings = require('../../../app/debug-settings');
var config = require('../../../app/config');


var logsPath = path.resolve(config.root, 'app-state', 'mindwave_logs');


function save(data) {
   if (!debugSettings.saveRecordedData) {
      console.log('Saving recorded data disabled.');
      return;
   }

   if (!data.length) {
      console.log('No data recorded.');
      return;
   }

   var fileName = '/' + new Date().getTime() + '.json';
   var dataStr = JSON.stringify(data);

   fs.writeFile(logsPath + fileName, dataStr, function(err) {
      if (err) throw err;
      console.log('It\'s saved!');
   });
}

function load(fileName, callback) {
   fs.readFile(logsPath + fileName, function(err, data) {
      if (err) throw err;

      if (callback) {
         callback(data);
      }
   });
}

function remove(fileName) {
   fs.unlink(logsPath + fileName, function(err) {
      if (err) throw err;

      console.log('deleted ' + fileName);
   });
}

function endsWith(str, suffix) {
   return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function getLogFilesList(callback) {
   fs.readdir(logsPath, function(err, res) {
      if (callback) {
         var jsonFiles = _.filter(res, function(f) {
            return endsWith(f, '.json');
         });

         callback(jsonFiles);
      }
   });
}

module.exports.save = save;
module.exports.load = load;
module.exports.remove = remove;
module.exports.getLogFilesList = getLogFilesList;
