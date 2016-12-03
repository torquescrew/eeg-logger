'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const settings = require('./debug-settings');

// This starts the server.
require('../server/server');

const debug = settings.debug;

//if (debug) {
//   server.emitFakeData();
//}

let mainWindow;

app.on('window-all-closed', function() {
   if (process.platform != 'darwin') {
      app.quit();
   }
});

app.on('ready', function() {
   const width = debug? 1400 : 900;
   const height = 823;

   let options = {};
   options.width = width;
   options.height = height;

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

   mainWindow.on('closed', function() {
      mainWindow = null;
   });
});
