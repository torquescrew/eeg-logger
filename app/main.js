'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// This starts the server.
const server = require('../server/server');


let mainWindow;

app.on('window-all-closed', function() {
   if (process.platform != 'darwin') {
      app.quit();
   }
});

app.on('ready', function() {
   const width = 900;
   const height = 800;

   mainWindow = new BrowserWindow({
      width: width,
      height: height,
      'min-width': width,
      'min-height': height,
      'max-width': width,
      'max-height': height
   });
   mainWindow.loadURL('file://' + __dirname + '/../public/index.html');
   //mainWindow.webContents.openDevTools();
   mainWindow.setMenu(null);

   mainWindow.on('closed', function() {
      mainWindow = null;
   });
});
