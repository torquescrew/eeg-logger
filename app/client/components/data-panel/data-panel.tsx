import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

import {Mode} from "../../util/constants";
import {dispatcher, Ev} from "../../util/dispatcher";
import {Size, Field} from "../../util/util";
import {DataFile} from "../../stores/data-file/data-file";

import {Controls} from '../controls/controls';
import {Stripe} from './stripe';
import {Btn} from '../controls/btn';
import {TimeAxis} from './time-axis';
import {DragState} from "./drag-state";


export class DataPanel extends React.Component<{
   dataStripeSize: Size,
   visibleStripes: Field[],
   dataFile: DataFile,
   location: any[],
   headsetConnected?: boolean,
   muted?: boolean,
   recording?: boolean
}, {
   leftPosition?: number,
   stickScrollToRight?: boolean,
   connectingHeadset?: boolean
}> {
   // Defaults
   state = {
      leftPosition: 0,
      stickScrollToRight: false,
      connectingHeadset: false
   };

   private dragState: DragState;

   static defaultProps = {
      muted: false,
      recording: false
   };

   componentDidMount() {
      dispatcher.socket.on('failedToConnectHeadset', this.handleFailureToConnect);

      dispatcher.on(Ev.StartRecording, this.playLog);
   }

   componentWillUnmount() {
      dispatcher.socket.removeListener('failedToConnectHeadset', this.handleFailureToConnect);

      dispatcher.removeListener(Ev.StartRecording, this.playLog);
   }

   handleFailureToConnect = () => {
      this.setState({
         connectingHeadset: false
      });
   };

   playLog = () => {
      this.setState({
         stickScrollToRight: true
      });
   };

   getElement(className: string): Element {
      return ReactDOM.findDOMNode(this).getElementsByClassName(className)[0];
   }

   onScroll = () => {
      const $stripe = $(this.getElement('stripe'));
      let $stripeContainer = $(this.refs['stripeContainer']);

      let leftPos = Math.floor($stripe.position().left - $stripeContainer.position().left);

      this.setState({
         leftPosition: leftPos
      });
   };

   onMouseDown = (e) => {
      const $stripe = $(this.getElement('stripe'));
      let $stripeContainer = $(this.refs['stripeContainer']);

      let left = $stripe.position().left - $stripeContainer.position().left;

      this.dragState = new DragState(left, e.clientX);
   };

   onMouseMove = (e) => {
      if (e.buttons) {
         let maxLeftPos = -(this.props.dataFile.getLengthOfStripe() - this.props.dataStripeSize.width);
         let xDiff = e.clientX - this.dragState.clientX;
         let newLeft = this.dragState.left + xDiff;
         let newPos = newLeft / maxLeftPos;

         this.scrollToPosition(newPos);
      }
   };

   getStyle() {
      return {
         width: this.props.dataStripeSize.width + 'px'
      }
   }

   zoomOut = () => {
      dispatcher.emit(Ev.SetPixPerMilliSec, this.props.dataFile.getPixPerMilliSec() / 2);

      this.setState({
         leftPosition: this.state.leftPosition
      });
   };

   zoomIn = () => {
      dispatcher.emit(Ev.SetPixPerMilliSec, this.props.dataFile.getPixPerMilliSec() * 2);

      this.setState({
         leftPosition: this.state.leftPosition
      });
   };

   scrollToPosition = (pos: number): void => {
      if (pos < 0 || pos > 1 || isNaN(pos)) {
         return;
      }

      const stripeContainer = this.refs['stripeContainer'] as HTMLElement;
      const maxScrollLeft = stripeContainer.scrollWidth - stripeContainer.clientWidth;

      stripeContainer.scrollLeft = maxScrollLeft * pos;

      const maxLeftPos = -(this.props.dataFile.getLengthOfStripe() - this.props.dataStripeSize.width);
      const leftPos = pos * maxLeftPos;

      if (leftPos !== this.state.leftPosition) {
         this.setState({
            leftPosition: leftPos
         });
      }
   };

   componentDidUpdate() {
      if (this.props.recording
         && (this.props.dataFile.getLengthOfStripe() > this.props.dataStripeSize.width)) {
         this.scrollToPosition(1.0);
      }

      if (this.state.connectingHeadset && !this.needToConnect()) {
         this.setState({
            connectingHeadset: false
         });
      }
   }

   renderStripes() {
      return this.props.visibleStripes.map((field: Field) => (
         <Stripe dataStripeSize={this.props.dataStripeSize}
                 dataFile={this.props.dataFile}
                 leftPosition={this.state.leftPosition}
                 field={field}
                 key={Field[field]} />
      ));
   }

   needToConnect() {
      return this.props.location[0] === Mode.Start && !this.props.headsetConnected;
   }

   needToConnectClass() {
      return this.needToConnect() ? ' needToConnect' : '';
   }

   renderConnectButton() {
      if (this.needToConnect()) {
         let text = this.state.connectingHeadset ? 'Connecting...' : 'Connect Headset';

         return (
            <div>
               <Btn text={text}
                    additionalClasses={["connect"]}
                    onClick={this.tryConnect} />
            </div>
         );
      }

      return null;
   }

   tryConnect = () => {
      dispatcher.emit(Ev.ConnectHeadset);

      this.setState({
         connectingHeadset: true
      });
   };

   render() {
      let controls = null;
      if (this.props.location[0] === Mode.Start) {
         controls = <Controls dataFile={this.props.dataFile}
                              recording={this.props.recording}
                              muted={this.props.muted}
                              disabled={this.needToConnect()} />;
      }

      return (
         <div className="dataPanelContainer disable-select">
            <div className={"stripeContainer" + this.needToConnectClass()}
                 ref="stripeContainer"
                 style={this.getStyle()}
                 onScroll={this.onScroll}
                 onMouseDown={this.onMouseDown}
                 onMouseMove={this.onMouseMove}
                 onTouchMove={this.onScroll} >

               {this.renderStripes()}

               <TimeAxis dataStripeSize={this.props.dataStripeSize}
                         dataFile={this.props.dataFile} />

               {this.renderConnectButton()}

            </div>
            <div className="dataPanelControls">
               <div className="scaleControls">
                  <Btn onClick={this.zoomIn} text="+" disabled={this.needToConnect()} />
                  <Btn onClick={this.zoomOut} text="-" disabled={this.needToConnect()} />
               </div>

               {controls}
            </div>
         </div>
      );
   }
}