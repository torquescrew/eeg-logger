import { EventEmitter } from 'events';
import { Size } from '../util/util';
import { DataFile } from './data-file/data-file';
import * as _ from 'underscore';
import * as dispatcher from '../util/dispatcher';

import {Mode} from '../util/constants';

let CHANGE_EVENT = 'change';

class Store extends EventEmitter {
   dataPanelSize: Size;
   dataFile: DataFile;
   logList: number[];
   location: any[];

   constructor(dataPanelSize: Size) {
      super();
      this.dataPanelSize = dataPanelSize;
      this.dataFile = new DataFile(this.dataPanelSize);
   }

   initDataFile() {
      if (this.location[0] === Mode.History) {
         if (!_.isUndefined(this.location[1])) {
            this.loadLog(this.location[1]);
         }
         else {
            this.loadLastDataFile();
         }
      }
   }

   loadLogList() {
      $.get('/logFileList', (logs: string[]) => {
         var list = _.map(logs, (e) => {
            return parseInt(e);
         });

         list.sort((a, b) => {
            return b - a;
         });

         this.logList = list;
         this.emitChange();
      })
   }

   loadLog(log: number) {
      $.get('/loadLog', {name: log + '.json'}).done(function(res) {
         this.dataFile = new DataFile(this.dataPanelSize);
         this.dataFile.appendArrayOfData(JSON.parse(res));
         this.emitChange();
      }.bind(this));
   }

   loadLastDataFile() {
      $.get('/logFileList', (list: number[]) => {
         this.loadLog(_.last(list))
      });
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