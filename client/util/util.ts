import * as moment from 'moment';

export class Size {
   width: number;
   height: number;

   constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
   }
}

export class Position {
   x: number;
   y: number;

   constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
   }
}

export function displayLogName(log: number) {
   return moment(log).format('MMMM Do YYYY, h:mm a');
}