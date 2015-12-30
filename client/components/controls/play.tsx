import * as React from 'react';
import {dispatcher} from '../../util/dispatcher';
import {Btn} from './btn';
import {Ev} from "../../util/dispatcher";


export class Play extends React.Component<{
   playing: boolean,
   disabled?: boolean
}, {}> {

   handlePlay() {
      dispatcher.emit(Ev.PlayLog);
      dispatcher.playLog('1447751933712');
   }

   handleStop() {
      dispatcher.stopPlayingLog();
      dispatcher.emit(Ev.StopPlaying);
   }

   playButton() {
      if (this.props.playing) {
         return <Btn onClick={this.handleStop} text="Stop" disabled={this.props.disabled} />;
      }
      else {
         return <Btn onClick={this.handlePlay} text="Play" disabled={this.props.disabled} />;
      }
   }

   render() {
      return (
         this.playButton()
      );
   }
}
