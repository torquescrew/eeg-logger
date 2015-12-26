import * as React from "react";
import * as ReactDOM from "react-dom";
import { DataStore, MainState } from './stores/data-store';
import { Size } from './util/util';

import { Menu } from './components/menu';

import { dispatcher, Ev } from './util/dispatcher';

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
      console.log(this.state);

      return (
         <div className="main">
            <Menu location={this.state.location} />
            <div className="screen">

            </div>
         </div>
      );
   }
}

ReactDOM.render(
   <Main />,
   document.getElementById('content')
);