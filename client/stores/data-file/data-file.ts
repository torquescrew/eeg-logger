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

      var i = _.findIndex(this.data, (e) => (e.getTime() - startTime) > time);

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
      let time = sample.getTime() - this.getStartTime();

      let x = this.mapper.timeToPixel(time) - leftPix;
      let y = this.mapper.valueToYPixel(sample.getField(field));

      return new Position(x, y);
   }

   setPixPerMilliSec(pixPerMilliSec: number): void {
      this.mapper.setPixPerMilliSec(pixPerMilliSec);
   }

   getTimeDuration(): number {
      return this.getEndTime() - this.getStartTime();
   }

   getStartTime(): number {
      return this.data[0].getTime();
   }

   getEndTime(): number {
      return _.last(this.data).getTime();
   }

   isEmpty(): boolean {
      return this.data.length === 0;
   }
}