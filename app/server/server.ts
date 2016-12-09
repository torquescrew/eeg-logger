import * as appArgs from './config/app-args';
import * as http from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as shared from '../shared/config-shared';
import * as paths from './config/app-paths';

import * as settings from './util/settings';
import * as mindwave from './mindwave/mindwave-main';
import {MindwaveManager} from "./mindwave/MindwaveManager";


const player = require('./mindwave/mindwave-log-player');
const data = require('./mindwave/mindwave-data');


export function startServer() {
   const app = express();
   const server: http.Server = http.createServer(app);
   const sio: SocketIO.Server = socketIo(server);

   console.log(appArgs.devMode);

   app.use('/public', express.static(paths.public_));
   app.use('/dist', express.static(paths.dist));

   server.listen(shared.port, () => {
      console.log("Listening on port " + shared.port);
   });


   const headset = new MindwaveManager();

   sio.on('connection', (s: SocketIO.Socket) => {

      s.on('connectHeadset', () => {
         headset.connect();
      });

      s.on('startRecording', () => {
         headset.startRecording();
      });

      s.on('stopRecording', () => {
         headset.stopRecording();

         data.save(mindwave.getRecordedData());
      });

      s.on('deleteLog', name => {
         data.remove(name);
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
         });
      });

      s.on('saveSettings', data => {
         settings.saveSettings(data);
      });

      headset.setSocket(s);
   });
}


