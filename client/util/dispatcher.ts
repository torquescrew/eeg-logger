import * as io from 'socket.io-client';
import * as $ from 'jquery';
import {EventEmitter} from 'events';

//export let socket = io.connect('http://localhost:3081');
//export var client = new EventEmitter();

export enum Ev {
   PlayLog,
   LiveData,
   SelectLog,
   SelectMode,
   SetLocation
}

//export function playLog(name, callback) {
//   client.emit('playLog');
//
//   $.get('/playLog', {name: name}).done(function(res) {
//      if (callback)
//         callback(res);
//   });
//}
//
//export function stopPlayingLog() {
//   $.get('/stopPlaying');
//}

//export default {
//   socket: socket,
//   client: client,
//   playLog: playLog,
//   stopPlayingLog: stopPlayingLog
//}

class Dispatcher {
   private emitter: EventEmitter;
   public socket: SocketIOClient.Socket;

   constructor() {
      this.socket = io.connect('http://localhost:3081');
      this.emitter = new EventEmitter();
   }

   on = (event: Ev, listener: Function) => {
      this.emitter.on(Ev[event], listener);
   };

   emit = (event: Ev, args: any) => {
      this.emitter.emit(Ev[event], args);
   };

   //TODO: old way of doing things.
   playLog(name: string, callback: Function) {
      $.get('playLog', {name: name}).done(function(res) {
         if (callback)
            callback(res);
      });
   }

   stopPlayingLog() {
      $.get('/stopPlaying');
   }
}

export let dispatcher = new Dispatcher();

