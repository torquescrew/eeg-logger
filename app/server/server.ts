import * as path from 'path';

var player = require('./mindwave/mindwave-log-player');
var data = require('./mindwave/mindwave-data');
var mindwave = require('./mindwave/mindwave-main');

import * as express from 'express';

var app = express();

// import {Server} from 'http';
import * as http from 'http';

const server = http.createServer(app);
// var server = require('http').Server(app);

import * as socketIo from 'socket.io';

const sio = socketIo(server);
// var sio = require('socket.io')(server);

var settings = require('./util/settings');

var config = require('../../app/config');

// Also in dispatcher.ts
const PORT = 3081;


app.use('/public', express.static(path.join(config.root, 'app', 'public')));
app.use('/dist', express.static(path.join(config.root, 'app', 'dist')));

server.listen(PORT, function() {
   console.log("Listening on port " + PORT);
});

sio.on('connection', function(s) {

   s.on('connectHeadset', function() {
      mindwave.connect();
   });

   s.on('startRecording', function() {
      mindwave.startRecording();
   });

   s.on('stopRecording', function() {
      mindwave.stopRecording();
      data.save(mindwave.getRecordedData());
   });

   s.on('deleteLog', function(name) {
      data.remove(name);
   });

   s.on('logFileList', function() {
      data.getLogFilesList(function(list) {
         sio.emit('logFileList', list);
      });
   });

   s.on('loadLog', function(name) {
      data.load(name, function(data) {
         sio.emit('loadLog', data.toString());
      });
   });

   s.on('loadSettings', function() {
      settings.loadSettings(function(settings) {
         sio.emit('loadSettings', settings);
      })
   });

   s.on('saveSettings', function(data) {
      settings.saveSettings(data);
   });

   mindwave.setSocket(s);
});

