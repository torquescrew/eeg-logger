import * as React from 'react';
import {Size} from "../../util/util";
import {Mapper} from "../../stores/data-file/pix-mapper";
import {DataFile} from "../../stores/data-file/data-file";

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
      var context = this.state.context;
      var mapper = this.props.mapper;
      var dataFile = this.props.dataFile;
      var startX = -this.props.leftPosition;
      var width = this.props.dataPanelSize.width;

      context.clearRect(0, 0, +width, +this.props.dataPanelSize.height);
      if (dataFile.isEmpty()) {
         return;
      }

      var startIndex = dataFile.getClosestSampleIndex(mapper.pixelToTime(startX));
      var endIndex = dataFile.getClosestSampleIndex(mapper.pixelToTime(startX + width));

      context.lineWidth = 3;
      context.lineCap = 'round';
      context.lineJoin = 'round';

      this.drawTrace(
         startIndex,
         endIndex,
         dataFile,
         context,
         mapper,
         startX,
         width,
         "#00AA00",
         function (sample) {
            return sample.getMeditation();
         });

      this.drawTrace(
         startIndex,
         endIndex,
         dataFile,
         context,
         mapper,
         startX,
         width,
         "#0000FF",
         function (sample) {
            return sample.getAttention();
         });
   }

   drawTrace(startIndex, endIndex, dataFile, context, mapper, startX, width, colour, getter) {
      context.strokeStyle = colour;
      context.beginPath();

      var shift = 0;
      var length = mapper.getLengthOfStripe();
      if (length < width) {
         shift = width - length;
      }

      for (var i = startIndex; i < endIndex; i++) {
         var sample = dataFile.at(i);

         var x = Math.floor(shift + mapper.timeToPixel(sample.getTime() - dataFile.getStartTime()) - startX);
         var y = Math.floor(mapper.valueToYPixel(getter(sample)));

         if (i === startIndex) {
            context.moveTo(x, y);
         }
         else {
            context.lineTo(x, y);
         }
      }

      context.stroke();
   }

   //TODO
   calcXPix(time, startX, shift) {

   }

   //TODO
   drawCurvedPencilLine(annotation, context) {
      context.beginPath();

      var points = annotation.coords;

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
         this.drawData();
      }

      return (
         <canvas width={this.props.dataPanelSize.width}
                 height={this.props.dataPanelSize.height}
                 style={this.getStyle()}
                 id="canvas"/>
      );
   }
}
