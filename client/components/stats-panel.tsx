import * as React from 'react';
import {DataSample} from "../stores/data-file/data-sample";
import {DataFile} from "../stores/data-file/data-file";
import {Field} from "../util/util";


export class StatsPanel extends React.Component<{
   dataFile: DataFile,
   playing: boolean
}, {}> {

   liveValues() {
      let dataFile = this.props.dataFile;
      if (dataFile.isEmpty()) {
         return null;
      }
      var lastSample = this.props.dataFile.getLastSample();

      return (
         <div className="statsPanel">
            <div>
               <div className="value">{lastSample.getField(Field.Signal)}</div>
               <div className="label">Signal Quality</div>
            </div>
            <div>
               <div className="value">{lastSample.getField(Field.Attention)}</div>
               <div className="label">Attention</div>
            </div>
            <div>
               <div className="value">{lastSample.getField(Field.Meditation)}</div>
               <div className="label">Meditation</div>
            </div>
         </div>
      );
   }

   averageValues() {
      let dataFile = this.props.dataFile;
      if (dataFile.isEmpty()) {
         return null;
      }

      return (
         <div className="statsPanel">
            <div>
               <div className="value">{dataFile.getMeanOfField(Field.Signal)}</div>
               <div className="label">Average Signal Quality</div>
            </div>
            <div>
               <div className="value">{dataFile.getMeanOfField(Field.Attention)}</div>
               <div className="label">Average Attention</div>
            </div>
            <div>
               <div className="value">{dataFile.getMeanOfField(Field.Meditation)}</div>
               <div className="label">Average Meditation</div>
            </div>
         </div>
      );
   }

   render() {
      if (this.props.playing) {
         return this.liveValues();
      }
      else {
         return this.averageValues();
      }
   }
}
