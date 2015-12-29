import {Size, Field} from '../util/util';
import {DataFile} from './data-file/data-file';
import * as $ from 'jquery';
import * as _ from 'underscore';
import {dispatcher, Ev} from '../util/dispatcher';

import {Mode} from '../util/constants';
import {Store} from "./store";


//TODO: Should this be split into 2 stores? settings and data-file stuff?

export interface MainState {
   dataStripeSize: Size,
   visibleStripes: Field[],
   dataFile: DataFile,
   logList: number[],
   location: any[],
   playing: boolean,
   muted: boolean,
   pixPerMilliSec: number
}

interface Settings {
   location: any[],
   playing: boolean,
   muted: boolean
}

export class DataStore extends Store implements MainState {
   dataStripeSize: Size;
   visibleStripes = [Field.Meditation, Field.Attention];
   dataFile: DataFile;
   logList = [];
   location = [Mode.Start];
   playing = false;
   muted = false;
   pixPerMilliSec = 0.01;

   constructor() {
      super();
      this.dataStripeSize = new Size(800, 150);
      this.dataFile = new DataFile(this.dataStripeSize, this.pixPerMilliSec, this.visibleStripes);

      dispatcher.on(Ev.PlayLog, () => {
         this.dataFile = new DataFile(this.dataStripeSize, this.pixPerMilliSec, this.visibleStripes);
         this.setPlaying(true);
         this.emitChange();
      });

      dispatcher.on(Ev.SetFieldVisibility, (options: {field: Field, visible: boolean}) => {
         if (options.visible) {
            this.visibleStripes.push(options.field);
         }
         else {
            this.visibleStripes = _.without(this.visibleStripes, options.field);
         }
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

      dispatcher.on(Ev.SetPixPerMilliSec, (pixPerMilliSec: number) => {
         this.pixPerMilliSec = pixPerMilliSec;
         this.dataFile.setPixPerMilliSec(pixPerMilliSec);
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
         this.dataFile = new DataFile(this.dataStripeSize, this.pixPerMilliSec, this.visibleStripes);
         this.dataFile.appendArrayOfData(JSON.parse(res));
         let pixPerMilliSec = this.dataFile.calcPixPerMilliSecToFit();

         this.dataFile.setPixPerMilliSec(this.dataFile.calcPixPerMilliSecToFit());

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
         dataStripeSize: this.dataStripeSize,
         visibleStripes: this.visibleStripes,
         dataFile: this.dataFile,
         logList: this.logList,
         location: this.location,
         playing: this.playing,
         muted: this.muted,
         pixPerMilliSec: this.pixPerMilliSec,
      };
   }

   finishedLoading(): boolean {
      return !_.isUndefined(this.dataFile)
         && !_.isUndefined(this.logList)
         && !_.isUndefined(this.location);
   }
}
