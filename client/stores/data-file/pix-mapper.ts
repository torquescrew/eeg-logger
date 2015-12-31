import {Size} from '../../util/util';
import {DataFile} from './data-file';
import {DataSample} from "./data-sample";
import {Field} from "../../util/util";

export class Mapper {
   dataStripeSize: Size;
   dataFile: DataFile;
   pixPerMilliSec: number;

   constructor(dataStripeSize: Size, dataFile: DataFile, pixPerMilliSec: number) {
      this.dataStripeSize = dataStripeSize;
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
      return this.dataStripeSize.width;
   }

   pixelToTime(x: number): number {
      let length = this.getLengthOfStripe();

      let scale = x / length;

      return scale * this.dataFile.getTimeDuration();
   }

   timeToPixel(time: number): number {
      return time * this.pixPerMilliSec;
   }

   valueToYPixel(sample: DataSample, field: Field): number {
      let value = sample.getField(field);

      let max = this.dataFile.getMaxValueForField(field);

      return (((max - value) / max) * (this.dataStripeSize.height - 5)) + 2;
   }
}