import * as React from 'react';
import * as ReactDOM from 'react-dom';
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
import {TimeAxis} from './time-axis';


export class DataPanel extends React.Component<{
   dataPanelSize: Size,
   dataFile: DataFile,
   location: any[]
   muted?: boolean,
   playing?: boolean
}, {
   leftPosition: number,
   stickScrollToRight: boolean
}> {

   static defaultProps = {
      muted: false,
      playing: false
   };
   
   state = {
      leftPosition: 0,
      stickScrollToRight: false
   };

   componentDidMount() {
      dispatcher.on(Ev.PlayLog, this.playLog);
   }

   componentWillUnmount() {
      dispatcher.removeListener(Ev.PlayLog, this.playLog);
   }

   playLog = () => {
      this.setState({
         leftPosition: 0,
         stickScrollToRight: true
      });
   };


   //TODO: Make sure this grabs the element inside this component only.
   getElement(className: string): Element {
      return ReactDOM.findDOMNode(this).getElementsByClassName(className)[0];
   }

   onScroll = () => {
      var $stripe = $(this.getElement('stripe'));
      let $stripeContainer = $(this.getElement('stripeContainer'));

      let leftPos = Math.floor($stripe.position().left - $stripeContainer.position().left);

      this.setState({
         leftPosition: leftPos,
         stickScrollToRight: this.state.stickScrollToRight
      });
   };

   getStyle() {
      return {
         width: this.props.dataPanelSize.width + 'px'
      }
   }

   zoomOut = () => {
      dispatcher.emit(Ev.SetPixPerMilliSec, this.props.dataFile.getPixPerMilliSec() / 2);

      this.setState({
         leftPosition: this.state.leftPosition,
         stickScrollToRight: this.state.stickScrollToRight
      });
   };

   zoomIn = () => {
      dispatcher.emit(Ev.SetPixPerMilliSec, this.props.dataFile.getPixPerMilliSec() * 2);

      this.setState({
         leftPosition: this.state.leftPosition,
         stickScrollToRight: this.state.stickScrollToRight
      });
   };

   scrollToRight = () => {
      let leftPos = this.props.dataFile.getLengthOfStripe() - this.props.dataPanelSize.width;

      if (leftPos !== this.state.leftPosition) {
         this.setState({
            leftPosition: this.props.dataFile.getLengthOfStripe() - this.props.dataPanelSize.width,
            stickScrollToRight: this.state.stickScrollToRight
         });
      }
   };

   componentDidUpdate() {
      if (this.state.stickScrollToRight) {
         this.scrollToRight();
      }
   }

   //TODO: hard coded id
   render() {
      var controls = null;
      if (this.props.location[0] === Mode.Start) {
         controls = <Controls dataFile={this.props.dataFile}
                              playing={this.props.playing}
                              muted={this.props.muted}/>;
      }

      return (
         <div className="dataPanelContainer">
            <div className="stripeContainer"
                 style={this.getStyle()}
                 onScroll={this.onScroll}
                 onTouchMove={this.onScroll} >
               <Stripe dataPanelSize={this.props.dataPanelSize}
                       dataFile={this.props.dataFile}
                       leftPosition={this.state.leftPosition} />
               <TimeAxis dataPanelSize={this.props.dataPanelSize}
                         dataFile={this.props.dataFile} />
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