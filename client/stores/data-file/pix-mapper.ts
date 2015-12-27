import {Size} from '../../util/util';
import {DataFile} from './data-file';

export class Mapper {
   dataPanelSize: Size;
   dataFile: DataFile;
   pixPerMilliSec: number;

   constructor(dataPanelSize: Size, dataFile: DataFile, pixPerMilliSec: number) {
      this.dataPanelSize = dataPanelSize;
      this.dataFile = dataFile;
      this.pixPerMilliSec = pixPerMilliSec;
   }

   setPixPerMilliSec(pixPerMilliSec: number): void {
      this.pixPerMilliSec = pixPerMilliSec;
   }

   getLengthOfStripe(): number {
      if (!this.dataFile.isEmpty()) {
         return this.dataFile.getTimeDuration() * this.pixPerMilliSec;
      }
      return this.dataPanelSize.width;
   }

   pixelToTime(x: number): number {
      let length = this.getLengthOfStripe();

      let scale = x / length;

      return scale * this.dataFile.getTimeDuration();
   }

   timeToPixel(time: number) {
      return time * this.pixPerMilliSec;
   }

   valueToYPixel(value: number) {
      return (((100 - value) / 105) * this.dataPanelSize.height) + 2;
   }
}