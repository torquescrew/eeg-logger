import { Size } from '../util/util';
import { DataFile } from './data-file/data-file';
import * as $ from 'jquery';
import * as _ from 'underscore';
import { dispatcher, Ev } from '../util/dispatcher';

import { Mode } from '../util/constants';
import { Store } from "./store";

//TODO: Should this be split into 2 stores? settings and data-file stuff?

export interface MainState {
   dataPanelSize: Size,
   dataFile: DataFile,
   logList: number[],
   location: any[],
   playing: boolean,
   muted: boolean
}

interface Settings {
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
         this.setPlaying(true);
         this.emitChange();
      });

      dispatcher.on(Ev.StopPlaying, () => {
         this.setPlaying(false);
         this.emitChange();
      });

      dispatcher.on(Ev.Mute, () => {
         this.setMuted(true);
         this.emitChange();
      });

      dispatcher.on(Ev.Unmute, () => {
         this.setMuted(false);
         this.emitChange();
      });

      dispatcher.socket.on('liveData', data => {
         this.setPlaying(true);
         this.dataFile.appendData(data);
         this.emitChange();
      });

      dispatcher.on(Ev.SelectLog, (log: number) => {
         this.loadLog(log, () => {
            this.emitChange();
         });
      });

      dispatcher.on(Ev.SelectMode, (mode: Mode) => {
         this.setLocation([mode]);
         this.emitChange();
      });

      dispatcher.on(Ev.SetLocation, (location: any[]) => {
         this.setLocation(location);
         this.emitChange();
      });

      this.loadLogList(() => {
         this.loadSettings(() => {
            this.initDataFile(() => {
               this.emitChange();
            });
         });
      });
   }

   setPlaying = (playing: boolean) => {
      if (this.playing !== playing) {
         this.playing = playing;
         this.saveSettings();
      }
   };

   setMuted = (muted: boolean) => {
      if (this.muted !== muted) {
         this.muted = muted;
         this.saveSettings();
      }
   };

   setLocation = (location: any[]) => {
      this.location = location;
      this.saveSettings();
   };

   saveSettings = () => {
      let settings: Settings = {
         location: this.location,
         playing: this.playing,
         muted: this.muted
      };

      dispatcher.socket.emit('saveSettings', settings);
   };

   initDataFile(callback: Function) {
      if (this.location[0] === Mode.History) {
         if (!_.isUndefined(this.location[1])) {
            let log: number = this.logList[this.location[1]];

            this.loadLog(log, callback);
         }
         else {
            this.loadLastDataFile(callback);
         }
      }
   }

   loadSettings(callback: Function) {
      $.get('/loadSettings', (settings: Settings) => {
         if (!_.isEmpty(settings)) {
            this.location = settings.location;
            this.playing = settings.playing;
            this.muted = settings.muted;

            callback();
         }

         console.log(settings);
      });
   }

   loadLogList(callback: Function) {
      $.get('/logFileList', (logs: string[]) => {
         var list = logs.map((e) => parseInt(e));

         list.sort((a, b) => b - a);

         this.logList = list;

         callback();
      });
   }

   loadLog(log: number, callback: Function): void {
      $.get('/loadLog', {name: log + '.json'}).done((res) => {
         this.dataFile = new DataFile(this.dataPanelSize);
         this.dataFile.appendArrayOfData(JSON.parse(res));

         callback();
      });
   }

   loadLastDataFile(callback: Function) {
      $.get('/logFileList', (list: string[]) => {
         this.loadLog(parseInt(_.last(list)), callback);
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
