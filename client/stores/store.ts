import { EventEmitter } from 'events';

let CHANGE_EVENT = 'change';

export abstract class Store extends EventEmitter {

   addChangeListener(callback): void {
      this.on(CHANGE_EVENT, callback);
   }

   removeChangeListener(callback): void {
      this.removeListener(CHANGE_EVENT, callback);
   }

   emitChange(): void {
      this.emit(CHANGE_EVENT);
   }

   abstract getState(): {}

   abstract finishedLoading(): boolean
}
