import * as React from 'react';
import {StripeScreen} from './stripe-screen';
import {Size, Field} from "../../util/util";
import {DataFile} from "../../stores/data-file/data-file";


export class Stripe extends React.Component<{
   dataStripeSize: Size,
   dataFile: DataFile,
   field: Field,
   leftPosition: number,
   key?: string
}, {}> {

   getStyle() {
      return {
         width: this.props.dataFile.getLengthOfStripe(),
         height: this.props.dataStripeSize.height + 'px'
      }
   }

   render() {
      return (
         <div className="stripe"
              style={this.getStyle()}>
            <StripeScreen dataStripeSize={this.props.dataStripeSize}
                          dataFile={this.props.dataFile}
                          leftPosition={this.props.leftPosition}
                          field={this.props.field} />
         </div>
      );
   }
}
