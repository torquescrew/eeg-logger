var mindwave = require('./mindwave.js');

var socket = null;
var client = null;

var recordedData = [];
var recording = false;
var connected = false;

function connect() {

   client = mindwave.createClient({
      appName:'NodeMindwave',
      appKey:'0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
   });

   client.on('data', function(data) {
      handleNewData(data);
   });

   client.connect();
}

function isConnected() {
   return connected;
}

function handleNewData(data) {
   var validData = !!data['eSense'];
   connected = validData;

   data.time = new Date().getTime();

   if (socket) {
      socket.emit('liveData', data);
   }

   if (recording && validData) {
      recordedData.push(data);
   }
}

function startRecording() {
   recordedData = [];
   recording = true;
}

function stopRecording() {
   recording = false;
}

function getRecordedData() {
   return recordedData;
}

function setSocket(s) {
   socket = s;
}


module.exports.connect = connect;
module.exports.isConnected = isConnected;
module.exports.setSocket = setSocket;
module.exports.startRecording = startRecording;
module.exports.stopRecording = stopRecording;
module.exports.getRecordedData = getRecordedData;
module.exports.handleNewData = handleNewData;
