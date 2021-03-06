import * as React from "react";
import * as ReactDOM from "react-dom";
import {DataStore, MainState} from './stores/data-store';
import {Size} from './util/util';

import {Menu} from './components/menu';
import {HistoryScreen} from './components/history-screen';
import {RecordScreen} from './components/record-screen';
import {SettingsScreen} from './components/settings-screen';

import {dispatcher, Ev} from './util/dispatcher';
import {Mode} from "./util/constants";


const store = new DataStore();


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

      let screen;

      switch (this.state.location[0]) {
         case Mode.History:
            screen = <HistoryScreen dataStripeSize={this.state.dataStripeSize}
                                    visibleStripes={this.state.visibleStripes}
                                    dataFile={this.state.dataFile}
                                    location={this.state.location}
                                    logList={this.state.logList} />;
            break;
         case Mode.Start:
            screen = <RecordScreen dataStripeSize={this.state.dataStripeSize}
                                   visibleStripes={this.state.visibleStripes}
                                   dataFile={this.state.dataFile}
                                   tempDataFile={this.state.tempDataFile}
                                   location={this.state.location}
                                   headsetConnected={this.state.headsetConnected}
                                   recording={this.state.recording}
                                   muted={this.state.muted} />;
            break;
         case Mode.Settings:
            screen = <SettingsScreen visibleStripes={this.state.visibleStripes} />
      }

      return (
         <div className="main">
            <Menu location={this.state.location}
                  recording={this.state.recording} />
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