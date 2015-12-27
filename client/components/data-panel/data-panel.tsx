import * as React from 'react';
import * as $ from 'jquery';
import {Mapper} from "../../stores/data-file/pix-mapper";
import {Mode} from "../../util/constants";
import {dispatcher} from "../../util/dispatcher";
import {Ev} from "../../util/dispatcher";
import {Size} from "../../util/util";
import {DataFile} from "../../stores/data-file/data-file";
import {Controls} from '../controls/controls';
import {Stripe} from './stripe';
import {Btn} from '../controls/btn';


export class DataPanel extends React.Component<{
   dataPanelSize: Size,
   dataFile: DataFile,
   location: any[]
   muted?: boolean,
   playing?: boolean
}, {
   pixPerMilliSecond: number,
   leftPosition: number,
   stickScrollToRight: boolean
}> {

   static defaultProps = {
      muted: false,
      playing: false
   };
   
   state = {
      pixPerMilliSecond: 0.01,
      leftPosition: 0,
      stickScrollToRight: false
   };

   componentDidMount() {
      dispatcher.on(Ev.PlayLog, this.playLog);

      $('#stripeContainer').on('scroll touchmove', this.onScroll);
   }

   componentWillUnmount() {
      dispatcher.removeListener(Ev.PlayLog, this.playLog);

      $('#stripeContainer').off('scroll touchmove', this.onScroll);
   }

   playLog = () => {
      this.setState({
         pixPerMilliSecond: this.state.pixPerMilliSecond,
         leftPosition: 0,
         stickScrollToRight: true
      });
   };

   onScroll = (e) => {
      var $stripe = $(e.target.lastChild);

      this.setState({
         pixPerMilliSecond: this.state.pixPerMilliSecond,
         leftPosition: Math.floor($stripe.position().left - $('#stripeContainer').position().left),
         stickScrollToRight: this.state.stickScrollToRight
      });
   };

   getStyle() {
      return {
         //height: this.props.height + 'px',
         width: this.props.dataPanelSize.width + 'px',
         overflowY: 'hidden',
         overflowX: 'auto'
         //position: 'relative'
      }
   }

   zoomOut = () => {
      dispatcher.emit(Ev.SetPixPerMilliSec, this.state.pixPerMilliSecond / 2);

      this.setState({
         leftPosition: this.state.leftPosition,
         pixPerMilliSecond: this.state.pixPerMilliSecond / 2,
         stickScrollToRight: this.state.stickScrollToRight
      });
   };

   zoomIn = () => {
      dispatcher.emit(Ev.SetPixPerMilliSec, this.state.pixPerMilliSecond * 2);

      this.setState({
         leftPosition: this.state.leftPosition,
         pixPerMilliSecond: this.state.pixPerMilliSecond * 2,
         stickScrollToRight: this.state.stickScrollToRight
      });
   };

   scrollToRight = () => {
      var sc = document.getElementById('stripeContainer');
      sc.scrollLeft = sc.scrollWidth;
   };

   componentDidUpdate() {
      if (this.state.stickScrollToRight) {
         this.scrollToRight();
      }
   }

   //TODO: hard coded id
   render() {
      var mapper = new Mapper(
         this.props.dataPanelSize,
         this.props.dataFile,
         this.state.pixPerMilliSecond);

      var controls = null;
      if (this.props.location[0] === Mode.Start) {
         controls = <Controls dataFile={this.props.dataFile}
                              playing={this.props.playing}
                              muted={this.props.muted}/>;
      }

      return (
         <div className="dataPanelContainer">
            <div id="stripeContainer" style={this.getStyle()}>
               <Stripe dataPanelSize={this.props.dataPanelSize}
                       dataFile={this.props.dataFile}
                       leftPosition={this.state.leftPosition}
                       mapper={mapper}/>
            </div>

            <div className="dataPanelControls">
               <div className="scaleControls">
                  <Btn onClick={this.zoomIn} text="+"/>
                  <Btn onClick={this.zoomOut} text="-"/>
               </div>

               {controls}
            </div>
         </div>
      );
   }
}