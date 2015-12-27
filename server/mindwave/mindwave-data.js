var fs = require('fs');
var _ = require('underscore');

var logsPath = '../app-state/mindwave_logs/';

function save(data) {
   if (!data.length) {
      console.log('No data recorded.');
      return;
   }

   var fileName = new Date().getTime() + '.json';
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
