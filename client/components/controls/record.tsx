import * as React from 'react';
import {dispatcher} from '../../util/dispatcher';
import {Btn} from './btn';
import {Ev} from "../../util/dispatcher";


export class Record extends React.Component<{
   recording: boolean,
   disabled?: boolean
}, {}> {

   handleStart() {
      dispatcher.emit(Ev.StartRecording);
      //dispatcher.playLog('1447751933712');
   }

   handleStop() {
      //dispatcher.stopPlayingLog();
      dispatcher.emit(Ev.StopRecording);
   }

   RecordButton() {
      if (this.props.recording) {
         return <Btn onClick={this.handleStop} text="Stop" disabled={this.props.disabled} />;
      }
      else {
         return <Btn onClick={this.handleStart} text="Start" disabled={this.props.disabled} />;
      }
   }

   render() {
      return (
         this.RecordButton()
      );
   }
}
