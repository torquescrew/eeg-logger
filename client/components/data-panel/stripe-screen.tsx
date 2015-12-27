import * as React from 'react';
import * as _ from 'underscore';
import {Size, Position} from "../../util/util";
import {Mapper} from "../../stores/data-file/pix-mapper";
import {DataFile} from "../../stores/data-file/data-file";
import {Field} from "../../stores/data-file/data-sample";

export class StripeScreen extends React.Component<{
   dataPanelSize: Size,
   mapper: Mapper,
   dataFile: DataFile,
   leftPosition: number
}, {
   canvas: HTMLCanvasElement,
   context: CanvasRenderingContext2D
}> {

   state = {
      canvas: null,
      context: null
   };

   componentDidMount () {
      this.initCanvas();
   }

   initCanvas() {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      const context = canvas.getContext('2d');

      this.setState({
         canvas: canvas,
         context: context
      });
   }

   drawData() {
      var context: CanvasRenderingContext2D = this.state.context;
      var dataFile = this.props.dataFile;
      var leftPix = -this.props.leftPosition;
      var width = this.props.dataPanelSize.width;

      context.clearRect(0, 0, +width, +this.props.dataPanelSize.height);
      if (dataFile.isEmpty()) {
         return;
      }

      context.lineWidth = 3;
      context.lineCap = 'round';
      context.lineJoin = 'round';

      this.drawTrace(leftPix, width, Field.Meditation, "#00AA00");
      this.drawTrace(leftPix, width, Field.Attention, "#0000FF");
      //this.drawTrace2(leftPix, width, Field.HighGamma, "#FF0000");
   }

   drawTrace(leftPix: number, width: number, field: Field, colour: string) {
      var context: CanvasRenderingContext2D = this.state.context;
      context.strokeStyle = colour;

      var dataFile = this.props.dataFile;

      var points: Position[] = dataFile.getPixPositionsForScreen(leftPix, width, field);

      if (points.length > 2) {
         this.drawCurvedLine(points, context);
      }
      else {
         this.drawStraightLine(points, context);
      }
   }

   drawStraightLine(points: Position[], context: CanvasRenderingContext2D) {
      context.beginPath();

      _.each(points, (p: Position, i: number) => {
         if (i === 0) {
            context.moveTo(p.x, p.y);
         }
         else {
            context.lineTo(p.x, p.y);
         }
      });

      context.stroke();
   }

   drawCurvedLine(points: Position[], context: CanvasRenderingContext2D) {
      context.beginPath();

      context.moveTo(points[0].x, points[0].y);

      for (var i = 1; i < points.length - 2; i++) {
         var xc = (points[i].x + points[i + 1].x) / 2;
         var yc = (points[i].y + points[i + 1].y) / 2;
         context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }

      // curve through the last two points
      context.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);

      context.stroke();
   }

   getStyle() {
      //var shift = 0;
      //
      //var length = this.props.mapper.getLengthOfStripe();
      //var width = this.props.dataPanelSize.width;
      //if (length < width) {
      //  shift = width - length;
      //}

      return {
         //position: 'absolute',
         //left: (-this.props.leftPosition) + 'px',
         position: 'fixed',
         backgroundColor: '#ffffff'
      };
   }

   render() {
      if (this.state.context) {
         //var t = _.now();
         this.drawData();
         //console.log(_.now() - t);
      }

      return (
         <canvas width={this.props.dataPanelSize.width}
                 height={this.props.dataPanelSize.height}
                 style={this.getStyle()}
                 id="canvas"/>
      );
   }
}
