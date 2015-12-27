import * as React from 'react';
import {DataFile} from "../stores/data-file/data-file";


export class AudioOut extends React.Component<{
   dataFile: DataFile,
   playing: boolean,
   muted: boolean
}, {}> {
   render() {
      return (
         <div></div>
      );
   }
}