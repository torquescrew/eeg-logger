import {DataSample} from './data-sample';
import {Mapper} from './pix-mapper';
import {Size} from '../../util/util';
import * as _ from 'underscore';

export class DataFile {
   private dataPanelSize: Size;
   private data: DataSample[];
   private mapper: Mapper;

   constructor(dataPanelSize: Size) {
      console.log('data file constructed!');

      this.dataPanelSize = dataPanelSize;
      this.mapper = new Mapper(dataPanelSize, this, 0.01);
      this.data = [];
   }

   appendData(data) {
      this.data.push(new DataSample(data));
   }

   appendArrayOfData(array: any[]) {
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

   at(index: number) {
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