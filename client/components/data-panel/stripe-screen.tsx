import * as React from 'react';
import * as _ from 'underscore';
import {Size, Position} from "../../util/util";
import {DataFile} from "../../stores/data-file/data-file";
import {Field, fieldColour} from "../../util/util";

//import {VirtualCanvas} from './virtual-canvas';

export class StripeScreen extends React.Component<{
   dataStripeSize: Size,
   field: Field,
   dataFile: DataFile,
   leftPosition: number
}, {
   canvas: HTMLCanvasElement,
   context: CanvasRenderingContext2D
}> {
   //virtualCanvas: VirtualCanvas;

   state = {
      canvas: null,
      context: null
   };

   componentDidMount () {
      this.initCanvas();
   }

   initCanvas() {
      const canvas = this.refs['canvas'] as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      //this.virtualCanvas = new VirtualCanvas(this.props.dataStripeSize);

      this.setState({
         canvas: canvas,
         context: context
      });
   }

   drawData() {
      var context: CanvasRenderingContext2D = this.state.context;
      var dataFile = this.props.dataFile;
      var leftPix = -this.props.leftPosition;
      var width = this.props.dataStripeSize.width;

      //let length = dataFile.getLengthOfStripe();
      //let shift = 0;
      //
      //if (length < width) {
      //   shift = (width - length);
      //}

      context.clearRect(0, 0, width, this.props.dataStripeSize.height);
      if (dataFile.isEmpty()) {
         return;
      }

      context.lineWidth = 3;
      context.lineCap = 'round';
      context.lineJoin = 'round';

      this.drawTrace(leftPix, width, this.props.field, fieldColour(this.props.field));
   }

   drawTrace(leftPix: number, width: number, field: Field, colour: string) {
      var context: CanvasRenderingContext2D = this.state.context;
      context.strokeStyle = colour;

      var dataFile = this.props.dataFile;

      //if (!this.virtualCanvas.isEmpty()) {
      //   let prevLeftPix = this.virtualCanvas.getLeftPix();
      //
      //   console.log('prev: ', prevLeftPix, ', now: ', leftPix);
      //
      //   if (prevLeftPix < leftPix) {
      //      this.virtualCanvas.blotVisibleRegion(this.state.context, leftPix);
      //      leftPix = prevLeftPix + width;
      //   }
      //   else {
      //      this.virtualCanvas.blotVisibleRegion(this.state.context, leftPix);
      //      width = prevLeftPix - leftPix;
      //   }
      //}

      var points: Position[] = dataFile.getPixPositionsForScreen(leftPix, width, field);

      if (points.length > 200) {
         context.lineWidth = 2;
      }
      //points = this.smoothPoints(points);

      if (points.length > 2) {
         this.drawCurvedLine(points, context, leftPix);
      }
      else {
         this.drawStraightLine(points, context, leftPix);
      }
   }

   calcShift() {
      var width = this.props.dataStripeSize.width;
      let length = this.props.dataFile.getLengthOfStripe();
      let shift = 0;

      if (length < width) {
         shift = (width - length);
      }
      return shift;
   }

   smoothPoints(points: Position[], numTimes?: number): Position[] {
      let smoothed = [];

      var prev: Position = null;

      _.each(points, (p, i) => {
         if (i === 0) {
            smoothed.push(p);
         }
         else {
            let x = (prev.x + p.x) / 2;
            let y = (prev.y + p.y) / 2;
            smoothed.push(new Position(x, y));
         }
         prev = p;
      });

      if (numTimes && numTimes > 0) {
         return this.smoothPoints(smoothed, numTimes - 1);
      }
      return smoothed;
   }

   drawStraightLine(points: Position[], context: CanvasRenderingContext2D, leftPix: number) {
      context.beginPath();

      let shift = this.calcShift();

      _.each(points, (p: Position, i: number) => {
         if (i === 0) {
            context.moveTo(p.x + shift, p.y);
         }
         else {
            context.lineTo(p.x + shift, p.y);
         }
      });

      context.stroke();
      //this.virtualCanvas.saveCanvas(this.state.canvas, leftPix);
   }

   drawCurvedLine(points: Position[], context: CanvasRenderingContext2D, leftPix: number) {
      context.beginPath();
      let shift = this.calcShift();

      context.moveTo(points[0].x + shift, points[0].y);

      for (var i = 1; i < points.length - 2; i++) {
         var xc = (points[i].x + points[i + 1].x) / 2;
         var yc = (points[i].y + points[i + 1].y) / 2;
         context.quadraticCurveTo(points[i].x + shift, points[i].y, xc + shift, yc);
      }

      // curve through the last two points
      context.quadraticCurveTo(points[i].x + shift, points[i].y, points[i + 1].x + shift, points[i + 1].y);

      context.stroke();
      //this.virtualCanvas.saveCanvas(this.state.canvas, leftPix);
   }

   getStyle() {
      //var shift = 0;
      //
      //var length = this.props.mapper.getLengthOfStripe();
      //var width = this.props.dataStripeSize.width;
      //if (length < width) {
      //  shift = width - length;
      //}

      return {
         //position: 'absolute',
         //left: (-this.props.leftPosition) + 'px',
         position: 'fixed',
         backgroundColor: '#ffffff',
         pointerEvents: 'none'
      };
   }

   componentDidUpdate() {
      //this.drawData();
   }

   render() {
      if (this.state.context) {
         this.drawData();
      }

      return (
         <div>
            <canvas width={this.props.dataStripeSize.width}
                    height={this.props.dataStripeSize.height}
                    style={this.getStyle()}
                    ref="canvas" />
            <div className="channelName">{Field[this.props.field]}</div>
         </div>
      );
   }
}
