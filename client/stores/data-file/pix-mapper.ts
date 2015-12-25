import {Size} from '../../util/util';
import {DataFile} from './data-file';

export class Mapper {
   dataPanelSize: Size;
   dataFile: DataFile;
   pixelPerMilliSecond: number;

   constructor(dataPanelSize: Size, dataFile: DataFile, pixelPerMilliSecond: number) {
      this.dataPanelSize = dataPanelSize;
      this.dataFile = dataFile;
      this.pixelPerMilliSecond = pixelPerMilliSecond;
   }

   getLengthOfStripe(): number {
      if (!this.dataFile.isEmpty()) {
         return this.dataFile.getTimeDuration() * this.pixelPerMilliSecond;
      }
      return this.dataPanelSize.width;
   }

   pixelToTime(x: number): number {
      let length = this.getLengthOfStripe();

      let scale = x / length;

      return scale * this.dataFile.getTimeDuration();
   }

   timeToPixel(time: number) {
      return time * this.pixelPerMilliSecond;
   }

   valueToYPixel(value: number) {
      return (((100 - value) / 105) * this.dataPanelSize.height) + 2;
   }
}