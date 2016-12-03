import * as http from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as config from '../config/config';
import * as paths from '../config/app-paths';

import * as settings from './util/settings';
import * as mindwave from './mindwave/mindwave-main';


const player = require('./mindwave/mindwave-log-player');
const data = require('./mindwave/mindwave-data');


const app = express();
const server: http.Server = http.createServer(app);
const sio: SocketIO.Server = socketIo(server);


app.use('/public', express.static(paths.public_));
app.use('/dist', express.static(paths.dist));

server.listen(config.port, () => {
   console.log("Listening on port " + config.port);
});

sio.on('connection', (s: SocketIO.Socket) => {

   s.on('connectHeadset', () => {
      // mindwave.connect();
   });

   s.on('startRecording', () => {
      // mindwave.startRecording();
   });

   s.on('stopRecording', () => {
      // mindwave.stopRecording();
      // data.save(mindwave.getRecordedData());
   });

   s.on('deleteLog', name => {
      // data.remove(name);
   });

   s.on('logFileList', () => {
      data.getLogFilesList(list => {
         sio.emit('logFileList', list);
      });
   });

   s.on('loadLog', name => {
      data.load(name, data => {
         sio.emit('loadLog', data.toString());
      });
   });

   s.on('loadSettings', () => {
      settings.loadSettings(settings => {
         sio.emit('loadSettings', settings);
      })
   });

   s.on('saveSettings', data => {
      settings.saveSettings(data);
   });

   mindwave.setSocket(s);
});

