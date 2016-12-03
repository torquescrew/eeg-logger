import {Size} from "../../util/util";
import * as _ from 'underscore';

export class VirtualCanvas {
   canvas: HTMLCanvasElement;
   context: CanvasRenderingContext2D;
   dataStripeSize: Size;
   leftPix: number;

   constructor(dataStripeSize: Size) {
      this.dataStripeSize = dataStripeSize;
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.dataStripeSize.width;
      this.canvas.height = this.dataStripeSize.height;
      this.context = this.canvas.getContext('2d');
   }

   saveCanvas(canvas: HTMLCanvasElement, leftPix: number) {
      this.context.clearRect(0, 0, this.dataStripeSize.width, this.dataStripeSize.height);
      this.context.drawImage(canvas, 0, 0);
      this.leftPix = leftPix;
   }

   blotVisibleRegion(context: CanvasRenderingContext2D, leftPix: number) {
      context.drawImage(this.canvas, this.leftPix - leftPix, 0);
   }

   getLeftPix(): number {
      return this.leftPix;
   }

   isEmpty() {
      return _.isUndefined(this.leftPix);
   }

}