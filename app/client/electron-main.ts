import {app, BrowserWindow} from 'electron';
import * as config from '../server/config/config';


export function initWindow() {
   const debug = config.getAppMode().debug;


   let mainWindow;

   app.on('window-all-closed', () => {
      if (process.platform != 'darwin') {
         app.quit();
      }
   });

   app.on('ready', () => {
      const width = debug? 1400 : 900;
      const height = 823;

      let options = {};
      options['width'] = width;
      options['height'] = height;

      if (!debug) {
         options['min-width'] = width;
         options['min-height'] = height;
         options['max-width'] = width;
         options['max-height'] = height;
      }

      mainWindow = new BrowserWindow(options);
      mainWindow.loadURL('http://localhost:3081/public/index.html');

      if (debug) {
         mainWindow.webContents.openDevTools();
      }

      mainWindow.setMenu(null);

      mainWindow.on('closed', () => {
         mainWindow = null;
      });
   });
}