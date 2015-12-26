import * as React from 'react';
import {dispatcher} from '../../util/dispatcher';
import {Btn} from './btn';
import {Ev} from "../../util/dispatcher";


export class Play extends React.Component<{
   playing: boolean
}, {}> {

   getDefaultProps() {
      return {
         playing: false
      };
   }

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
         return <Btn onClick={this.handleStop} text="Stop" />;
      }
      else {
         return <Btn onClick={this.handlePlay} text="Play" />;
      }
   }

   render() {
      return (
         this.playButton()
      );
   }
}
