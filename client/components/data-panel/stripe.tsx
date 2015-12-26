import * as React from 'react';
import {StripeScreen} from './stripe-screen';
import {Size} from "../../util/util";
import {DataFile} from "../../stores/data-file/data-file";
import {Mapper} from "../../stores/data-file/pix-mapper";


export class Stripe extends React.Component<{
   dataPanelSize: Size,
   dataFile: DataFile,
   leftPosition: number,
   mapper: Mapper
}, {}> {

   getStyle() {
      return {
         width: this.props.mapper.getLengthOfStripe(),
         height: this.props.dataPanelSize.height + 'px',
         backgroundColor: '#fafafa'
      }
   }

   render() {
      return (
         <div style={this.getStyle()}>
            <StripeScreen dataPanelSize={this.props.dataPanelSize}
                          dataFile={this.props.dataFile}
                          leftPosition={this.props.leftPosition}
                          mapper={this.props.mapper} />
         </div>
      );
   }
}
