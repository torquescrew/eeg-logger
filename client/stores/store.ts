import { EventEmitter } from 'events';
import { Size } from '../util/util';
import { DataFile } from './data-file/data-file';

let CHANGE_EVENT = 'change';

class Store extends EventEmitter {
   dataPanelSize: Size;
   dataFile: DataFile;

   constructor(dataPanelSize: Size) {
      super();
      this.dataPanelSize = dataPanelSize;
      this.dataFile = new DataFile(this.dataPanelSize);
   }

   addChangeListener(callback): void {
      this.on(CHANGE_EVENT, callback);
   }

   removeChangeListener(callback) {
      this.removeListener(CHANGE_EVENT, callback);
   }

   emitChange() {
      this.emit(CHANGE_EVENT);
   }

   doSomething() {
      console.log('do something2');
   }
}

let store = new Store(new Size(800, 400));

export default store;