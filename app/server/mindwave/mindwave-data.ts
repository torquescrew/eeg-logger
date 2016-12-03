import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'underscore';

// import {settings} from '../../debug-settings';
import * as config from '../config/config';
import * as paths from '../config/app-paths';


const logsPath = path.resolve(paths.root, 'app-state', 'mindwave_logs');


export function save(data) {
   if (!config.getAppMode().saveRecordedData) {
      console.log('Saving recorded data disabled.');
      return;
   }

   if (!data.length) {
      console.log('No data recorded.');
      return;
   }

   const fileName = '/' + new Date().getTime() + '.json';
   const dataStr = JSON.stringify(data);

   fs.writeFile(logsPath + fileName, dataStr, function(err) {
      if (err) throw err;
      console.log('It\'s saved!');
   });
}

export function load(fileName, callback) {
   fs.readFile(logsPath + fileName, function(err, data) {
      if (err) throw err;

      if (callback) {
         callback(data);
      }
   });
}

export function remove(fileName) {
   fs.unlink(logsPath + fileName, function(err) {
      if (err) throw err;

      console.log('deleted ' + fileName);
   });
}

export function endsWith(str, suffix) {
   return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export function getLogFilesList(callback) {
   fs.readdir(logsPath, function(err, res) {
      if (callback) {
         const jsonFiles = _.filter(res, function (f) {
            return endsWith(f, '.json');
         });

         callback(jsonFiles);
      }
   });
}

