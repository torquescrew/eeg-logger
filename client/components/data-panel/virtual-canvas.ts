import {Size} from "../../util/util";
import * as _ from 'underscore';

export class VirtualCanvas {
   canvas: HTMLCanvasElement;
   context: CanvasRenderingContext2D;
   dataPanelSize: Size;
   leftPix: number;

   constructor(dataPanelSize: Size) {
      this.dataPanelSize = dataPanelSize;
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.dataPanelSize.width;
      this.canvas.height = this.dataPanelSize.height;
      this.context = this.canvas.getContext('2d');
   }

   saveCanvas(canvas: HTMLCanvasElement, leftPix: number) {
      this.context.clearRect(0, 0, this.dataPanelSize.width, this.dataPanelSize.height);
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