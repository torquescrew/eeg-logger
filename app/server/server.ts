import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as config from '../../app/config';


var player = require('./mindwave/mindwave-log-player');
var data = require('./mindwave/mindwave-data');
// var mindwave = require('./mindwave/mindwave-main');
import * as mindwave from './mindwave/mindwave-main';


const app = express();
const server = http.createServer(app);
const sio = socketIo(server);


var settings = require('./util/settings');




app.use('/public', express.static(path.join(config.root, 'app', 'public')));
app.use('/dist', express.static(path.join(config.root, 'app', 'dist')));

server.listen(config.port, function() {
   console.log("Listening on port " + config.port);
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

