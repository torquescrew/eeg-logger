import * as React from 'react';

import {Record} from './record';
import {Mute} from './mute';
import {DataFile} from "../../stores/data-file/data-file";


export class Controls extends React.Component<{
   dataFile: DataFile,
   recording: boolean,
   muted: boolean,
   disabled?: boolean
}, {}> {

   render() {
      return (
         <div className="playControls">
            <Record recording={this.props.recording} disabled={this.props.disabled} />
            <Mute muted={this.props.muted} disabled={this.props.disabled} />
         </div>
      );
   }
}

