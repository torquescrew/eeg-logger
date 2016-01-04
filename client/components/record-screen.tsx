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



export class RecordScreen extends React.Component<{
   dataStripeSize: Size,
   visibleStripes: Field[],
   dataFile: DataFile,
   location: any[],
   headsetConnected: boolean,
   recording: boolean,
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
                       recording={this.props.recording}
                       muted={this.props.muted}
                       location={this.props.location} />

            <StatsPanel dataFile={this.props.dataFile}
                        recording={this.props.recording} />

            <AudioOut recording={this.props.recording}
                      muted={this.props.muted}
                      dataFile={this.props.dataFile} />
         </div>
      );
   }
}
