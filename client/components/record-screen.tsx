import * as React from 'react';

import {StatsPanel} from './stats-panel';
import {DataPanel} from './data-panel/data-panel';
import {AudioOut} from './audio-out';

import {dispatcher} from '../util/dispatcher';
import {Mode} from '../util/constants';
import {DataFile} from "../stores/data-file/data-file";
import {Size} from "../util/util";
import {Ev} from "../util/dispatcher";
import {Field} from "../util/util";
//import {Btn} from './controls/btn';



export class RecordScreen extends React.Component<{
   dataStripeSize: Size,
   visibleStripes: Field[],
   dataFile: DataFile,
   location: any[],
   headsetConnected: boolean,
   playing: boolean,
   muted: boolean
},{}> {

   render() {
      if (this.props.location[0] !== Mode.Start) {
         return null;
      }

      return (
         <div className="recordScreen">
            <DataPanel dataStripeSize={this.props.dataStripeSize}
                       visibleStripes={this.props.visibleStripes}
                       dataFile={this.props.dataFile}
                       headsetConnected={this.props.headsetConnected}
                       playing={this.props.playing}
                       muted={this.props.muted}
                       location={this.props.location} />



            <StatsPanel dataFile={this.props.dataFile}
                        playing={this.props.playing} />

            <AudioOut playing={this.props.playing}
                      muted={this.props.muted}
                      dataFile={this.props.dataFile} />
         </div>
      );
   }
}
