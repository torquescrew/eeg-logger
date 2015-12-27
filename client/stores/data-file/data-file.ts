import {DataSample} from './data-sample';
import {Mapper} from './pix-mapper';
import {Size, Position} from '../../util/util';
import * as _ from 'underscore';
import {Field} from "./data-sample";

export class DataFile {
   private dataPanelSize: Size;
   private data: DataSample[];
   private mapper: Mapper;

   constructor(dataPanelSize: Size, pixPerMilliSec: number) {
      this.dataPanelSize = dataPanelSize;
      this.mapper = new Mapper(dataPanelSize, this, pixPerMilliSec);
      this.data = [];
   }

   appendData(data): void {
      this.data.push(new DataSample(data));
   }

   appendArrayOfData(array: any[]): void {
      array.forEach((data) => this.appendData(data));
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
      let endIndex = this.getClosestSampleIndex(this.mapper.pixelToTime(leftPix + width));

      let positions: Position[] = [];

      for (var i = startIndex; i < endIndex; i++) {
         positions.push(this.getPixPositionForSample(this.at(i), field, leftPix));
      }

      return positions;
   }

   getPixPositionForSample(sample: DataSample, field: Field, leftPix: number): Position {
      let time = sample.getField(Field.Time) - this.getStartTime();

      let x = this.mapper.timeToPixel(time) - leftPix;
      let y = this.mapper.valueToYPixel(sample.getField(field));

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
      return this.dataPanelSize.width / this.getTimeDuration();
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

   isEmpty(): boolean {
      return this.data.length === 0;
   }
}