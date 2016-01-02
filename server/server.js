var path = require('path');

var player = require('./mindwave/mindwave-log-player');
var data = require('./mindwave/mindwave-data');
var mindwave = require('./mindwave/mindwave-main');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var settings = require('./util/settings');

// Also in dispatcher.ts
const PORT = 3081;


app.use(express.static(path.join(__dirname, '../public')));

server.listen(PORT, function() {
   console.log("Listening on port " + PORT);
});

io.on('connection', function(s) {

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
         s.emit('logFileList', list);
      });
   });

   s.on('loadLog', function(name) {
      data.load(name, function(data) {
         s.emit('loadLog', data.toString());
      });
   });

   s.on('loadSettings', function() {
      settings.loadSettings(function(settings) {
         s.emit('loadSettings', settings);
      })
   });

   s.on('saveSettings', function(data) {
      settings.saveSettings(data);
   });

   mindwave.setSocket(s);
});















