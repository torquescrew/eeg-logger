var path = require('path');

var player = require('./mindwave/mindwave-log-player');
var data = require('./mindwave/mindwave-data');
var mindwave = require('./mindwave/mindwave-main');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var settings = require('./util/settings');

function start() {

   app.get('/playLog', function(req, res) {
      var name = req.query.name;
      //player.playLog(name);
      player.playLast();

      res.send('done');
   });

   app.get('/stopPlaying', function(req, res) {
      player.stop();

      res.send('done');
   });

   app.get('/connectHeadset', function(req, res) {
      mindwave.connect();
      res.send(mindwave.isConnected());
   });

   app.get('/headsetConnected', function(req, res) {
      res.send(mindwave.isConnected());
   });

   app.get('/startRecording', function(req, res) {
      mindwave.startRecording();
      res.send('OK');
   });

   app.get('/stopRecording', function(req, res) {
      mindwave.stopRecording();

      data.save(mindwave.getRecordedData());

      res.send('OK');
   });

   app.get('/logFileList', function(req, res) {
      data.getLogFilesList(function(list) {
         res.send(list);
      });
   });

   app.get('/loadLog', function(req, res) {
      var name = req.query.name;
      data.load(name, function(data) {
         res.send(data);
      });
   });

   app.get('/deleteLog', function(req, res) {
      var name = req.query.name;
      data.remove(name);
      res.send('OK');
   });

   app.get('/loadSettings', function(req, res) {
      //console.log(req.query);

      settings.loadSettings(function(settings) {
         res.send(settings);
      })
   });

   app.use(express.static(path.join(__dirname, '../public')));

   server.listen(3081, function() {
      console.log("Listening on port 3081");
   });

   io.on('connection', function(s) {

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

      console.log('connection!');
      mindwave.setSocket(s);
   });

}

module.exports.start = start;












