import * as React from 'react';

import {Play} from './play';
import {Mute} from './mute';
import {DataFile} from "../../stores/data-file/data-file";


export class Controls extends React.Component<{
   dataFile: DataFile,
   playing: boolean,
   muted: boolean
}, {}> {

   getDefaultProps() {
      return {
         playing: false,
         muted: false
      };
   }

   render() {
      return (
         <div className="playControls">
            <Play playing={this.props.playing} />
            <Mute muted={this.props.muted} />
         </div>
      );
   }
}

