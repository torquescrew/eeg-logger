import * as React from "react";
import * as ReactDOM from "react-dom";
import store from './stores/store';

interface MainState {
   size: number
}


class Main extends React.Component<{}, MainState> {
   state: MainState = {
      size: 100
   };

   componentDidMount() {
      this.setState({
         size: 102
      });

      store.doSomething();
   }

   render() {
      console.log(this.state.size);

      return (
         <div>hi</div>
      );
   }
}

ReactDOM.render(
   <Main />,
   document.getElementById('content')
);