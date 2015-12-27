import * as React from 'react';
import {DataSample} from "../stores/data-file/data-sample";
import {DataFile} from "../stores/data-file/data-file";

export class StatsPanel extends React.Component<{
   dataFile: DataFile
}, {}> {
   render() {
      var lastSample = this.props.dataFile.getLastSample();

      return (
         <table>
            <tbody>
               <tr>
                  <td>Signal Quality</td>
                  <td>{lastSample ? lastSample.getSignal() : 0}</td>
               </tr>
               <tr>
                  <td>Attention</td>
                  <td>{lastSample ? lastSample.getAttention() : 0}</td>
               </tr>
               <tr>
                  <td>Meditation</td>
                  <td>{lastSample ? lastSample.getMeditation() : 0}</td>
               </tr>
            </tbody>
         </table>
      );
   }
}
