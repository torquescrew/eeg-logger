import * as io from 'socket.io-client';
import * as $ from 'jquery';
import {EventEmitter} from './eventemitter';

const PORT = 3081;

export enum Ev {
   LiveData,
   SelectLog,
   SelectMode,
   SetLocation,
   Mute,
   Unmute,
   SetPixPerMilliSec,
   SetFieldVisibility,
   ConnectHeadset,
   StartRecording,
   StopRecording
}

class Dispatcher {
   private emitter: EventEmitter;
   public socket: SocketIOClient.Socket;

   constructor() {
      this.socket = io.connect('http://localhost:' + PORT);
      this.emitter = new EventEmitter();
   }

   on = (event: Ev, listener: Function) => {
      const e: string = Ev[event];
      this.emitter.on(Ev[event], listener);
   };

   emit = (event: Ev, args?: any) => {
      this.emitter.emit(Ev[event], args);
   };

   removeListener = (event: Ev, listener: Function) => {
      this.emitter.removeListener(Ev[event], listener);
   };

   get = (event: string, callback?: Function) => {
      this.socket.emit(event);

      if (callback) {
         this.socket.once(event, callback);
      }
   };

   req = (event: string, data: any, callback: Function) => {
      this.socket.emit(event, data);
      this.socket.once(event, callback);
   };

}

export let dispatcher = new Dispatcher();

