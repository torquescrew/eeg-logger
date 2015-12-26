import * as React from 'react';
import * as _ from 'underscore';

import { dispatcher, Ev } from '../util/dispatcher';
import * as util from '../util/util';
import {DataFile} from "../stores/data-file/data-file";
import {DisplayLog} from './display-log';


export class HistoryScreen extends React.Component<{
   dataFile: DataFile,
   location: any[],
   logList: number[]
}, {}> {

   selectLog(log: number, i: number): void {
      var location = this.props.location;

      location[1] = i;
      dispatcher.emit(Ev.SetLocation, location);
      dispatcher.emit(Ev.SelectLog, log);
   }

   buildList(): JSX.Element {
      var list = [];

      _.each(this.props.logList, (e, i) => {
         list.push(
            <div className="button logTitle"
                 onClick={this.selectLog.bind(this, e, i)}
                 key={i}>
               {util.displayLogName(e)}
            </div>
         )
      });

      return (
         <div className="historyList">
            {list}
         </div>
      );
   }

   render() {
      var view = null;

      if (!_.isUndefined(this.props.location[1])) {
         //TODO
      }
      else {
         view = this.buildList();
      }

      return (
         <div>
            {view}
         </div>
      )
   }
}