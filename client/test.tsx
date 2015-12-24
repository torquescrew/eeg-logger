import * as React from "react";
import * as ReactDOM from "react-dom";

import sqr from './test2';

var a = sqr(6);

console.log(a);


interface TestProps extends React.Props<any> {
   name: string;
}

class Test extends React.Component<TestProps, {}> {

   render() {
      return <div>Hello {this.props.name}</div>;
   }
}

ReactDOM.render(
   <Test name="Toby"/>,
   document.getElementById('content')
);

