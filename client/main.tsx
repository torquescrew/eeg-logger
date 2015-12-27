import * as React from "react";
import * as ReactDOM from "react-dom";
import {DataStore, MainState} from './stores/data-store';
import {Size} from './util/util';

import {Menu} from './components/menu';
import {HistoryScreen} from './components/history-screen';
import {RecordScreen} from './components/record-screen';

import {dispatcher, Ev} from './util/dispatcher';
import {Mode} from "./util/constants";


var store = new DataStore(new Size(800, 400));


class Main extends React.Component<{}, MainState> {

   state: MainState = store.getState();

   componentDidMount() {
      store.addChangeListener(this.onStoreChange);
   }

   componentWillUnmount() {
      store.removeChangeListener(this.onStoreChange);
   }

   onStoreChange = () => this.setState(store.getState());

   render() {
      if (!store.finishedLoading()) {
         return null;
      }

      var screen;

      switch (this.state.location[0]) {
         case Mode.History:
            screen = <HistoryScreen dataPanelSize={this.state.dataPanelSize}
                                    dataFile={this.state.dataFile}
                                    location={this.state.location}
                                    logList={this.state.logList} />;
            break;
         case Mode.Start:
            screen = <RecordScreen dataPanelSize={this.state.dataPanelSize}
                                   dataFile={this.state.dataFile}
                                   location={this.state.location}
                                   playing={this.state.playing}
                                   muted={this.state.muted} />
            break;
      }

      return (
         <div className="main">
            <Menu location={this.state.location} />
            <div className="screen">
               {screen}
            </div>
         </div>
      );
   }
}

ReactDOM.render(
   <Main />,
   document.getElementById('content')
);