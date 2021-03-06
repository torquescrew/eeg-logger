import * as React from 'react';
import {dispatcher} from '../../util/dispatcher';
import {Btn} from './btn';
import {Ev} from "../../util/dispatcher";

export class Mute extends React.Component<{
   muted: boolean,
   disabled?: boolean
},{}> {

   mute() {
      dispatcher.emit(Ev.Mute);
   }

   unmute() {
      dispatcher.emit(Ev.Unmute);
   }

   render() {
      if (this.props.muted) {
         return (
            <Btn onClick={this.unmute} text="Unmute" disabled={this.props.disabled} />
         );
      }
      else {
         return (
            <Btn onClick={this.mute} text="Mute" disabled={this.props.disabled} />
         );
      }
   }
}