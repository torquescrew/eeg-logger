var mindwave = require('./mindwave');
var fakeData = require('./mindwave-fake-data');
import * as config from '../config/config';

var socket = null;
var client = null;

var recordedData = [];
var recording = false;
var connected = false;
var numOfBadSamples = 0;

if (config.getAppMode().fakeData) {
   fakeData.startEmitting(handleNewData);
}

export function connect() {
   numOfBadSamples = 0;

   client = mindwave.createClient({
      appName:'NodeMindwave',
      appKey:'0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
   });

   client.on('data', function(data) {
      handleNewData(data);
   });

   client.connect();
}

export function isConnected() {
   return connected;
}

export function handleNewData(data) {
   var validData = !!data['eSense'];
   connected = validData;

   if (!validData) {
      numOfBadSamples++;
      if (numOfBadSamples >= 100) {
         client.destroy();
         socket.emit('failedToConnectHeadset');
      }
   }
   else {
      numOfBadSamples = 0;
   }

   data.time = new Date().getTime();

   if (socket) {
      socket.emit('liveData', data);
   }

   if (recording && validData) {
      recordedData.push(data);
   }
}

export function startRecording() {
   recordedData = [];
   recording = true;
}

export function stopRecording() {
   recording = false;
}

export function getRecordedData() {
   return recordedData;
}

export function setSocket(s: SocketIO.Socket) {
   socket = s;
}

// module.exports.connect = connect;
// module.exports.isConnected = isConnected;
// module.exports.setSocket = setSocket;
// module.exports.startRecording = startRecording;
// module.exports.stopRecording = stopRecording;
// module.exports.getRecordedData = getRecordedData;
// module.exports.handleNewData = handleNewData;


