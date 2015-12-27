import * as React from 'react';

import {StatsPanel} from './stats-panel';
import {DataPanel} from './data-panel/data-panel';
import {AudioOut} from './audio-out';

import {dispatcher} from '../util/dispatcher';
import {Mode} from '../util/constants';
import {DataFile} from "../stores/data-file/data-file";
import {Size} from "../util/util";
import {Ev} from "../util/dispatcher";


export class RecordScreen extends React.Component<{
   dataPanelSize: Size,
   dataFile: DataFile,
   location: any[],
   playing: boolean,
   muted: boolean
},{}> {

   componentDidMount() {
      //TODO: this should be handled in data-store instead?
      dispatcher.socket.on('liveData', this.play);
      dispatcher.on(Ev.PlayLog, this.play);
      dispatcher.on(Ev.StopPlaying, this.stop);
      dispatcher.on(Ev.Mute, this.mute);
      dispatcher.on(Ev.Unmute, this.unmute);
   }

   componentWillUnmount() {
      dispatcher.socket.removeListener('liveData', this.play);
      dispatcher.removeListener(Ev.PlayLog, this.play);
      dispatcher.removeListener(Ev.StopPlaying, this.stop);
      dispatcher.removeListener(Ev.Mute, this.mute);
      dispatcher.removeListener(Ev.Unmute, this.unmute);
   }

   play = () => {
      //TODO
   };

   stop = () => {
      //TODO
   };

   mute = () => {

   };

   unmute = () => {

   };

   render() {
      if (this.props.location[0] !== Mode.Start) {
         return null;
      }

      return (
         <div className="recordScreen">
            <DataPanel dataPanelSize={this.props.dataPanelSize}
                       dataFile={this.props.dataFile}
                       playing={this.props.playing}
                       muted={this.props.muted}
                       location={this.props.location} />

            <StatsPanel dataFile={this.props.dataFile} />

            <AudioOut playing={this.props.playing}
                      muted={this.props.muted}
                      dataFile={this.props.dataFile} />
         </div>
      );
   }
}