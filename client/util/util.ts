import * as moment from 'moment';
import * as _ from 'underscore';

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

export enum Field {
   Attention,
   Meditation,
   Delta,
   Theta,
   LowAlpha,
   HighAlpha,
   LowBeta,
   HighBeta,
   LowGamma,
   HighGamma,
   Signal,
   Time
}

export function fieldColour(field: Field) {
   switch (field) {
      case Field.Meditation:
         return '#00aa00';
      case Field.Attention:
         return '#1133ff';
      default:
         return '#ff2222';
   }
}

//export function maxFieldValue(field: Field) {
//   switch (field) {
//      case Field.Meditation:
//         return 100;
//      case Fi
//   }
//}

export function getFieldNames() {
   let fields = [];

   _.each(Field as any, (field) => {
      if (_.isString(field)) {
         fields.push(field);
      }
   });
   fields.pop(); //Remove 'Time'

   return fields;
}

export function displayLogName(log: number) {
   return moment(log).format('MMMM Do YYYY, h:mm a');
}