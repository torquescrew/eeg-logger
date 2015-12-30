import {DataSample} from './data-sample';
import {Mapper} from './pix-mapper';
import {Size, Position, Field} from '../../util/util';
import * as _ from 'underscore';


export class DataFile {
   private dataStripeSize: Size;
   private visibleFields: Field[];
   private fieldMaxValues: {};
   private data: DataSample[];
   private mapper: Mapper;

   constructor(dataStripeSize: Size, pixPerMilliSec: number, visibleFields: Field[]) {

      this.dataStripeSize = dataStripeSize;
      this.visibleFields = visibleFields;
      this.mapper = new Mapper(dataStripeSize, this, pixPerMilliSec);
      this.data = [];
   }

   appendData(data, calcFieldMaxes: boolean = true): void {
      this.data.push(new DataSample(data));

      if (calcFieldMaxes)
         this.calculateFieldMaxValues();
   }

   appendArrayOfData(array: any[]): void {
      array.forEach((data) => this.appendData(data, false));
      this.calculateFieldMaxValues();
   }

   updateParams(dataStripeSize: Size, pixPerMilliSec: number, visibleFields: Field[]) {
      this.dataStripeSize = dataStripeSize;
      this.visibleFields = visibleFields;
      this.mapper = new Mapper(dataStripeSize, this, pixPerMilliSec);
   }

   getLastSample(): DataSample {
      if (this.isEmpty()) {
         return null;
      }
      else {
         return _.last(this.data);
      }
   };

   at(index: number): DataSample {
      return this.data[index];
   }

   getClosestSampleIndex(time: number): number {
      var startTime = this.getStartTime();

      var i = _.findIndex(this.data, (e: DataSample) => (e.getField(Field.Time) - startTime) > time);

      if (i === -1) {
         return this.data.length - 1;
      }
      return i;
   }

   getPixPositionsForScreen(leftPix: number, width: number, field: Field): Position[] {
      let startIndex = this.getClosestSampleIndex(this.mapper.pixelToTime(leftPix));
      startIndex = _.max([0, startIndex - 1]);

      let endIndex = this.getClosestSampleIndex(this.mapper.pixelToTime(leftPix + width));
      endIndex = _.min([this.data.length, endIndex + 1]);

      let positions: Position[] = [];

      for (var i = startIndex; i < endIndex; i++) {
         positions.push(this.getPixPositionForSample(this.at(i), field, leftPix));
      }

      return positions;
   }

   getPixPositionForSample(sample: DataSample, field: Field, leftPix: number): Position {
      let time = sample.getField(Field.Time) - this.getStartTime();

      let x = Math.floor(this.mapper.timeToPixel(time) - leftPix);
      let y = Math.floor(this.mapper.valueToYPixel(sample, field));

      return new Position(x, y);
   }

   getMeanOfField(field: Field): number {
      let sum = _.reduce(this.data, (total: number, sample: DataSample) => {
         return total + sample.getField(field);
      }, 0);

      return Math.floor(sum / this.data.length);
   }

   getLengthOfStripe(): number {
      return this.mapper.getLengthOfStripe();
   }

   setPixPerMilliSec(pixPerMilliSec: number): void {
      this.mapper.setPixPerMilliSec(pixPerMilliSec);
   }

   calcPixPerMilliSecToFit() {
      return this.dataStripeSize.width / this.getTimeDuration();
   }

   getPixPerMilliSec(): number {
      return this.mapper.pixPerMilliSec;
   }

   getTimeDuration(): number {
      return this.getEndTime() - this.getStartTime();
   }

   getStartTime(): number {
      return this.at(0).getField(Field.Time);
   }

   getEndTime(): number {
      return _.last(this.data).getField(Field.Time);
   }

   pixelToTime(xPix: number, startAtZero: boolean = false): number {
      if (startAtZero) {
         return this.mapper.pixelToTime(xPix) - this.getStartTime();
      }
      return Math.round(this.mapper.pixelToTime(xPix));
   }

   private calculateFieldMaxValues() {
      let max = (field: Field): number => {
         return _.max(this.data, (sample: DataSample) => {
            return sample.getField(field);
         }).getField(field);
      };

      let maxValues = [];

      this.visibleFields.forEach((field: Field) => {
         switch (field) {
            case Field.Meditation:
               maxValues[field] = 100;
               break;
            case Field.Attention:
               maxValues[field] = 100;
               break;
            default:
               maxValues[field] = max(field);
               break;
         }
      });

      this.fieldMaxValues = maxValues;
   }

   getMaxValueForField(field: Field): number {
      return this.fieldMaxValues[field];
   }

   isEmpty(): boolean {
      return this.data.length === 0;
   }

   numOfSamples(): number {
      return this.data.length;
   }
}