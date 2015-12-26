import * as moment from 'moment';

export class Size {
   width: number;
   height: number;

   constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
   }
}

export function displayLogName(log: number) {
   return moment(log).format('MMMM Do YYYY, h:mm a');
}