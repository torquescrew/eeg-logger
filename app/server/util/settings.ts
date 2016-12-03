import * as fs from 'fs';
import * as path from 'path';
import * as paths from '../../config/app-paths';


const settingsPath = path.resolve(paths.root + '/app-state/state.json');


export function saveSettings(settings) {
   const settingsStr = JSON.stringify(settings);

   fs.writeFile(settingsPath, settingsStr, (err) => {
      if (err) throw err;
   });
}

export function loadSettings(callback) {
   fs.readFile(settingsPath, (err, settings) => {
      if (err) {
         console.log(settingsPath + " doesn't exist");
         if (callback) {
            callback({});
         }
      }
      else if (callback) {
         callback(JSON.parse(settings.toString()));
      }
   });
}
