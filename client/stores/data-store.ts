import { Size } from '../util/util';
import { DataFile } from './data-file/data-file';
import * as $ from 'jquery';
import * as _ from 'underscore';
import * as dispatcher from '../util/dispatcher';

import { Mode } from '../util/constants';
import { Store } from "./store";


export interface MainState {
   dataPanelSize: Size,
   dataFile: DataFile,
   logList: number[],
   location: any[]
}

export class DataStore extends Store {
   dataPanelSize: Size;
   dataFile: DataFile;
   logList: number[];
   location: any[];

   constructor(dataPanelSize: Size) {
      super();
      this.dataPanelSize = dataPanelSize;
      this.dataFile = new DataFile(this.dataPanelSize);
      this.location = [Mode.Start];

      this.loadLogList();


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

         list.sort((a, b) => b - a);

         this.logList = list;
         this.emitChange();
      });
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

   getState(): MainState {
      return {
         dataPanelSize: this.dataPanelSize,
         dataFile: this.dataFile,
         logList: this.logList,
         location: this.location
      };
   }

   finishedLoading(): boolean {
      return !_.isUndefined(this.dataFile)
         && !_.isUndefined(this.logList)
         && !_.isUndefined(this.location);
   }
}
