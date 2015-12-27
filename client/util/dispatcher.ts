import * as io from 'socket.io-client';
import * as $ from 'jquery';
import {EventEmitter} from 'events';


export enum Ev {
   PlayLog,
   StopPlaying,
   LiveData,
   SelectLog,
   SelectMode,
   SetLocation,
   Mute,
   Unmute,
   SetPixPerMilliSec
}

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

   emit = (event: Ev, args?: any) => {
      this.emitter.emit(Ev[event], args);
   };

   removeListener = (event: Ev, listener: Function) => {
      this.emitter.removeListener(Ev[event], listener);
   };

   //TODO: old way of doing things.
   playLog(name: string, callback?: Function) {
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

