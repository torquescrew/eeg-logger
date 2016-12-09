import {HeadsetManager} from "../headset";
const mindwave = require('./mindwave');
// var fakeData = require('./mindwave-fake-data');
// import * as config from '../config/config';


export class MindwaveManager implements HeadsetManager {

   private socket: SocketIO.Socket = null;
   private client: any = null;

   private connected = false;
   private recording = false;
   private numBadSamples = 0;
   private recordedData = [];

   connect() {
      this.numBadSamples = 0;

      this.client = mindwave.createClient({
         appName:'NodeMindwave',
         appKey:'0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
      });

      this.client.on('data', (data) => {
         this.handleNewData(data);
      });

      this.client.connect();
   }

   isConnected() {
      return this.connected;
   }

   handleNewData(data) {
      const validData = !!data['eSense'];
      this.connected = validData;

      if (!validData) {
         this.numBadSamples++;
         if (this.numBadSamples >= 100) {
            this.client.destroy();
            this.socket.emit('failedToConnectHeadset');
         }
      }
      else {
         this.numBadSamples = 0;
      }

      data.time = new Date().getTime();

      if (this.socket) {
         this.socket.emit('liveData', data);
      }

      if (this.recording && validData) {
         this.recordedData.push(data);
      }
   }

   setSocket(s: SocketIO.Socket) {
      this.socket = s;
   }

   startRecording() {
      this.recordedData = [];
      this.recording = true;
   }

   stopRecording() {
      this.recording = false;
   }

   getRecordedData() {
      return this.recordedData;
   }

}
