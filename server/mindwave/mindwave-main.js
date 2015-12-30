var mindwave = require('./mindwave.js');
var _ = require('underscore');

var socket = null;
var client = null;

var recordedData = [];
var recording = false;

function connect() {

   client = mindwave.createClient({
      appName:'NodeMindwave',
      appKey:'0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
   });

   client.on('data',function(data){
      console.log(data);

      handleNewData(data);
   });

   client.connect();
}

function isConnected() {
   return !!(client && client.isConnected());
}

function handleNewData(data) {
   if (!data['eSense']) {
      return;
   }

   data.time = new Date().getTime();

   if (socket) {
      socket.emit('liveData', data);
   }

   if (recording) {
      recordedData.push(data);
   }
}

function startRecording() {
   recordedData = [];
   recording = true;
}

function stopRecording() {
   recording = false;
   var meanMeditation = calcMeanMeditation();
   var meanAttention = calcMeanAttention();

   if (socket) {
      socket.emit('stats', {
         meanMeditation: meanMeditation,
         meanAttention: meanAttention
      });
   }
}

function getRecordedData() {
   return recordedData;
}

function setSocket(s) {
   socket = s;
}

function calcMeanMeditation() {
   if (recordedData.length === 0) {
      return 0;
   }

   var totalMeditation = _.reduce(recordedData, function(sum, data) {
      return sum + data['eSense']['meditation'];
   }, 0);

   return totalMeditation / recordedData.length;
}

function calcMeanAttention() {
   if (recordedData.length === 0) {
      return 0;
   }

   var totalAttention = _.reduce(recordedData, function(sum, data) {
      return sum + data['eSense']['attention'];
   }, 0);

   return totalAttention / recordedData.length;
}


module.exports.connect = connect;
module.exports.isConnected = isConnected;
module.exports.setSocket = setSocket;
module.exports.startRecording = startRecording;
module.exports.stopRecording = stopRecording;
module.exports.getRecordedData = getRecordedData;
module.exports.handleNewData = handleNewData;
