import { Size } from '../util/util';
import { DataFile } from './data-file/data-file';
import * as $ from 'jquery';
import * as _ from 'underscore';
import { dispatcher, Ev } from '../util/dispatcher';

import { Mode } from '../util/constants';
import { Store } from "./store";


export interface MainState {
   dataPanelSize: Size,
   dataFile: DataFile,
   logList: number[],
   location: any[],
   playing: boolean,
   muted: boolean
}

export class DataStore extends Store implements MainState {
   dataPanelSize: Size;
   dataFile: DataFile;
   logList = [];
   location = [];
   playing = false;
   muted = false;

   constructor(dataPanelSize: Size) {
      super();
      this.dataPanelSize = dataPanelSize;
      this.dataFile = new DataFile(this.dataPanelSize);
      this.location = [Mode.Start];
      this.playing = false;
      this.muted = false;

      dispatcher.on(Ev.PlayLog, () => {
         this.dataFile = new DataFile(this.dataPanelSize);
         this.emitChange();
      });

      dispatcher.socket.on('liveData', (data) => {
         dispatcher.emit(Ev.LiveData, data); //TODO: check that this works.
         this.dataFile.appendData(data);
         this.emitChange();
      });

      dispatcher.on(Ev.SelectLog, (log: number) => {
         this.loadLog(log);
      });

      dispatcher.on(Ev.SelectMode, (mode: Mode) => {
         this.location = [mode];
         this.emitChange();
      });

      dispatcher.on(Ev.SetLocation, (location: any[]) => {
         this.location = location;
         this.emitChange();
      });

      this.loadLogList();
      this.initDataFile();
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
         var list = logs.map((e) => parseInt(e));

         list.sort((a, b) => b - a);

         this.logList = list;
         this.emitChange();
      });
   }

   loadLog(log: number): void {
      $.get('/loadLog', {name: log + '.json'}).done((res) => {
         this.dataFile = new DataFile(this.dataPanelSize);
         this.dataFile.appendArrayOfData(JSON.parse(res));
         this.emitChange();
      });
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
         location: this.location,
         playing: this.playing,
         muted: this.muted
      };
   }

   finishedLoading(): boolean {
      return !_.isUndefined(this.dataFile)
         && !_.isUndefined(this.logList)
         && !_.isUndefined(this.location);
   }
}
