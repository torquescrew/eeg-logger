import {Size, Field} from '../util/util';
import {DataFile} from './data-file/data-file';
import * as $ from 'jquery';
import * as _ from 'underscore';
import {dispatcher, Ev} from '../util/dispatcher';

import {Mode} from '../util/constants';
import {Store} from "./store";


//TODO: Should this be split into 2 stores?

export interface MainState {
   dataStripeSize: Size;
   visibleStripes: Field[];
   dataFile: DataFile;
   tempDataFile: DataFile;
   logList: number[];
   location: any[];
   recording: boolean;
   muted: boolean;
   pixPerMilliSec: number;
   headsetConnected: boolean;
}

interface Settings {
   location: any[];
   visibleStripes: Field[];
   recording: boolean;
   muted: boolean;
}

export class DataStore extends Store implements MainState {
   dataStripeSize: Size;
   visibleStripes = [Field.Meditation, Field.Attention, Field.Signal];
   dataFile: DataFile;
   tempDataFile: DataFile;
   logList = [];
   location = [Mode.Start];
   recording = false;
   muted = false;
   pixPerMilliSec = 0.01;
   headsetConnected = false;

   timeAtLastSample = 0;


   constructor() {
      super();
      this.dataStripeSize = new Size(800, 400 / this.visibleStripes.length);
      this.dataFile = new DataFile(this.dataStripeSize, this.pixPerMilliSec, this.visibleStripes);
      this.tempDataFile = new DataFile(this.dataStripeSize, this.pixPerMilliSec, this.visibleStripes);
      this.tempDataFile.fillWithEmptySamples(20);

      dispatcher.on(Ev.StartRecording, () => {
         this.dataFile = new DataFile(this.dataStripeSize, this.pixPerMilliSec, this.visibleStripes);

         dispatcher.get('startRecording');

         this.setPlaying(true);
         this.emitChange();
      });

      dispatcher.on(Ev.StopRecording, () => {
         this.setPlaying(false);

         dispatcher.get('stopRecording');

         this.loadLogList(() => {
            this.emitChange();
         });
      });

      dispatcher.on(Ev.SetFieldVisibility, (options: {field: Field, visible: boolean}) => {
         if (options.visible) {
            this.visibleStripes.push(options.field);
         }
         else {
            this.visibleStripes = _.without(this.visibleStripes, options.field);
         }
         this.updateDataFileParams();
         this.emitChange();
         this.saveSettings();
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
         console.log(data);
         this.timeAtLastSample = _.now();

         if (data['eSense']) {
            //if (!this.headsetConnected) {
            //   this.dataFile = new DataFile(this.dataStripeSize, this.pixPerMilliSec, this.visibleStripes);
            //   this.emitChange();
            //}
            this.headsetConnected = true;
            if (this.recording) {
               this.dataFile.appendData(data);
            }
            else {
               this.tempDataFile.appendData(data);
               this.tempDataFile.truncateForNiceDisplay();
            }
            this.emitChange();
         }
         else if (data['blinkStrength']) {

         }
         else if (this.headsetConnected) {
            this.headsetConnected = false;
            //if (this.recording)
            this.recording = false;
            this.emitChange();
         }
      });

      dispatcher.on(Ev.ConnectHeadset, () => {
         this.tryConnectHeadset();
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

      setInterval(() => {
         if (this.timeAtLastSample + 2000 < _.now()) {
            if (this.headsetConnected || this.recording) {
               this.headsetConnected = false;
               this.recording = false;
               this.emitChange();
            }
         }
      }, 1000);
   }

   updateDataFileParams = () => {
      this.dataStripeSize = new Size(800, 400 / this.visibleStripes.length);
      this.dataFile.updateParams(this.dataStripeSize, this.pixPerMilliSec, this.visibleStripes);
      this.tempDataFile.updateParams(this.dataStripeSize, this.pixPerMilliSec, this.visibleStripes);
   };

   setPlaying = (recording: boolean) => {
      if (this.recording !== recording) {
         this.recording = recording;
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
         recording: this.recording,
         muted: this.muted,
         visibleStripes: this.visibleStripes
      };

      dispatcher.socket.emit('saveSettings', settings);
   };

   initDataFile(callback: Function) {
      if (!_.isUndefined(this.location[1])) {
         let log: number = this.logList[this.location[1]];

         this.loadLog(log, callback);
      }
      else {
         this.loadLastDataFile(callback);
      }
   }

   tryConnectHeadset = () => {
      if (this.timeAtLastSample + 3000 < _.now()) {
         dispatcher.get('connectHeadset');
      }
   };

   loadSettings(callback: Function) {
      dispatcher.get('loadSettings', (settings: Settings) => {
         if (!_.isEmpty(settings)) {
            this.location = settings.location;
            this.recording = settings.recording;
            this.muted = settings.muted;
            this.visibleStripes = settings.visibleStripes;
            this.updateDataFileParams();
         }
         callback();

         console.log(settings);
      });
   }

   loadLogList(callback: Function) {
      dispatcher.get('logFileList', (logs: string[]) => {
         var list = logs.map((e) => parseInt(e));
         list.sort((a, b) => b - a);
         this.logList = list;

         callback();
      });
   }

   loadLog(log: number, callback: Function): void {
      dispatcher.req('loadLog', '/' + log + '.json', (res: string) => {
         this.dataFile = new DataFile(this.dataStripeSize, this.pixPerMilliSec, this.visibleStripes);
         this.dataFile.appendArrayOfData(JSON.parse(res));

         this.dataFile.setPixPerMilliSec(this.dataFile.calcPixPerMilliSecToFit());

         callback();
      });
   }

   loadLastDataFile(callback: Function) {
      dispatcher.get('logFileList', (list: string[]) => {
         this.loadLog(parseInt(_.last(list)), callback);
      });
   }

   getState(): MainState {
      return {
         dataStripeSize: this.dataStripeSize,
         visibleStripes: this.visibleStripes,
         dataFile: this.dataFile,
         tempDataFile: this.tempDataFile,
         logList: this.logList,
         location: this.location,
         recording: this.recording,
         muted: this.muted,
         pixPerMilliSec: this.pixPerMilliSec,
         headsetConnected: this.headsetConnected
      };
   }

   finishedLoading(): boolean {
      return !_.isUndefined(this.dataFile)
         && !_.isUndefined(this.logList)
         && !_.isUndefined(this.location);
   }
}
