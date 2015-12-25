import * as io from 'socket.io-client';
import * as $ from 'jquery';
import {EventEmitter} from 'events';

let socket = io.connect('http://localhost:3081');
var client = new EventEmitter();

function playLog(name, callback) {
   client.emit('playLog');

   $.get('/playLog', {name: name}).done(function(res) {
      if (callback)
         callback(res);
   });
}

function stopPlayingLog() {
   $.get('/stopPlaying');
}

export default {
   socket: socket,
   client: client,
   playLog: playLog,
   stopPlayingLog: stopPlayingLog
}