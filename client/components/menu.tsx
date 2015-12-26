import * as React from 'react';
import * as dispatcher from '../util/dispatcher';
import { Mode } from '../util/constants';

export class Menu extends React.Component<{
   location: any[]
}, {}> {

   onClickSettings() {
      dispatcher.client.emit('selectMode', Mode.Settings);
   }

   onClickStart() {
      dispatcher.client.emit('selectMode', Mode.Start);
   }

   onClickHistory() {
      dispatcher.client.emit('selectMode', Mode.History);
   }

   render() {
      return (
         <div className="menu disable-select">
            <div id="settings"
                 className={"menuButton" + (this.props.location[0] === Mode.Settings ? ' selected' : '')}
                 onClick={this.onClickSettings}>
               Settings
            </div>
            <div id="start"
                 className={"menuButton" + (this.props.location[0] === Mode.Start ? ' selected' : '')}
                 onClick={this.onClickStart}>
               Start
            </div>
            <div id="history"
                 className={"menuButton" + (this.props.location[0] === Mode.History ? ' selected' : '')}
                 onClick={this.onClickHistory}>
               History
            </div>
         </div>
      );
   }
}