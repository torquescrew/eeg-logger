import * as React from 'react';
import * as _ from 'underscore';
import {DataFile} from "../stores/data-file/data-file";
import {Field} from "../util/util";


export class AudioOut extends React.Component<{
   dataFile: DataFile,
   playing: boolean,
   muted: boolean
}, {}> {

   state = {
      note1: null,
      note2: null,
      note3: null,
      note4: null,
      nextNoteTime: 0
   };

   componentDidMount() {
      this.setState({
         note1: document.getElementById('note1'),
         note2: document.getElementById('note2'),
         note3: document.getElementById('note3'),
         note4: document.getElementById('note4')
      });
   }

   getMeditation(): number {
      var dataFile = this.props.dataFile;
      if (dataFile.isEmpty()) {
         return 0;
      }
      return dataFile.getLastSample().getField(Field.Meditation);
   }

   calcRate(): number {
      return -8 * this.getMeditation() + 1000;
   }

   calcNote(): string {
      var score = this.getMeditation();

      if (score < 25) {
         return 'note1';
      }
      if (score < 50) {
         return 'note2';
      }
      if (score < 75) {
         return 'note3';
      }
      return 'note4';
   }

   playNote() {
      var note = this.state[this.calcNote()];

      note.currentTime = 0;
      note.play();
   }

   queueNextNote() {
      var delay = this.calcRate();

      this.setState({
         nextNoteTime: _.now() + delay
      });
   }

   play = () => {
      if (this.props.playing && !this.props.muted) {
         if (_.now() >= this.state.nextNoteTime) {
            this.playNote();
            this.queueNextNote();
         }
         else {
            setTimeout(this.play, this.calcRate() / 10);
         }
      }
   };

   componentDidUpdate() {
      this.play();
   }

   render() {
      return (
         <div>
            <audio id="note1" src="audio/xylophone-mp3/D4.mp3" type="audio/mpeg"/>
            <audio id="note2" src="audio/xylophone-mp3/A4.mp3" type="audio/mpeg"/>
            <audio id="note3" src="audio/xylophone-mp3/D5.mp3" type="audio/mpeg"/>
            <audio id="note4" src="audio/xylophone-mp3/G6.mp3" type="audio/mpeg"/>
         </div>
      );
   }

}