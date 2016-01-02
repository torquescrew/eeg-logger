'use strict';
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

const server = require('../server/server');


let mainWindow;

app.on('window-all-closed', function() {
   if (process.platform != 'darwin') {
      app.quit();
   }
});

app.on('ready', function() {
   server.start();

   mainWindow = new BrowserWindow({width: 1800, height: 1100});
   mainWindow.loadURL('file://' + __dirname + '/../public/index.html');
   mainWindow.webContents.openDevTools();

   mainWindow.on('closed', function() {
      mainWindow = null;
   });
});
