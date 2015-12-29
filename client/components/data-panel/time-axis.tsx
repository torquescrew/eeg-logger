import * as React from 'react';
import {DataFile} from "../../stores/data-file/data-file";
import {Size} from "../../util/util";
import * as moment from 'moment';
import * as _ from 'underscore';

export class TimeAxis extends React.Component<{
   dataFile: DataFile,
   dataStripeSize: Size
}, {}> {

   getStyle(): any {
      let len = this.props.dataFile.getLengthOfStripe();
      let w = this.props.dataStripeSize.width;
      if (len < w) {
         return {
            width: len,
            marginLeft: (w - len) + 'px'
         }
      }

      return {
         width: len + 'px'
      }
   }

   renderTimeValues() {
      let dataFile = this.props.dataFile;
      if (dataFile.isEmpty()) {
         return null;
      }

      let vals = [];
      var len = dataFile.getLengthOfStripe();
      let width = 80;
      let numOfVals = Math.floor(len / width) + 2;
      let pos = 0;


      for (let i = 0; i < numOfVals; i++) {
         let time = moment(dataFile.pixelToTime(pos)).format('m:ss');

         vals.push(
            <div className="value" key={i}>{time}</div>
         );
         pos += width;
      }
      return vals;
   }

   render() {
      return (
         <div className="timeAxis disable-select" style={this.getStyle()}>
            <div className="valueHolder">
               {this.renderTimeValues()}
            </div>
         </div>
      );
   }
}