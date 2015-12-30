import * as React from 'react';
import {DataFile} from "../stores/data-file/data-file";
import {Btn} from './controls/btn';
import {dispatcher} from "../util/dispatcher";
import {Ev} from "../util/dispatcher";
import * as util from '../util/util';
import {Size} from "../util/util";
import {DataPanel} from './data-panel/data-panel';
import {StatsPanel} from './stats-panel';
import {Field} from "../util/util";


export class DisplayLog extends React.Component<{
   dataStripeSize: Size,
   visibleStripes: Field[],
   dataFile: DataFile,
   location: any[],
   logList: number[]
}, {}> {

   onClickBack = () => {
      var location = this.props.location;

      if (location.length > 1) {
         location.pop();
      }

      dispatcher.emit(Ev.SetLocation, location);
   };

   onClickNext = () => {
      var location = this.props.location;
      var i = location[1];

      if (i > 0) {
         i--;
         location[1] = i;
         dispatcher.emit(Ev.SetLocation, location);
         dispatcher.emit(Ev.SelectLog, this.props.logList[i]);
      }
   };

   onClickPrev = () => {
      var location = this.props.location;
      var i = location[1];

      if (i < this.props.logList.length - 1) {
         i++;
         location[1] = i;
         dispatcher.emit(Ev.SetLocation, location);
         dispatcher.emit(Ev.SelectLog, this.props.logList[i]);
      }
   };

   hidePrevButton() {
      var i = this.props.location[1];
      var l = this.props.logList.length;

      return i >= l - 1;
   }

   hideNextButton() {
      var i = this.props.location[1];

      return i <= 0;
   }

   render() {
      var name = util.displayLogName(this.props.logList[this.props.location[1]]);

      return (
         <div className="displayLog">
            <Btn text="List" onClick={this.onClickBack} additionalClasses={['leftArrow']} />

            <div className="logNavigation">
               <Btn text="Prev" onClick={this.onClickPrev}
                    hide={this.hidePrevButton()} />
               <div className="logTitle">
                  {name}
               </div>
               <Btn text="Next" onClick={this.onClickNext}
                    hide={this.hideNextButton()} />
            </div>

            <DataPanel dataStripeSize={this.props.dataStripeSize}
                       visibleStripes={this.props.visibleStripes}
                       dataFile={this.props.dataFile}
                       location={this.props.location}  />

            <StatsPanel dataFile={this.props.dataFile}
                        playing={false} />
         </div>
      );
   }
}