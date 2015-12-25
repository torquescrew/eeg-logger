import * as React from "react";
import * as ReactDOM from "react-dom";

import nums from './singleton';

import sqr from './test2';

var a = sqr(nums.one);

console.log(a);


interface TestProps extends React.Props<any> {
   name: string;
}

class Test extends React.Component<TestProps, {}> {

   componentDidMount() {
      console.log('yay');
   }

   render() {
      return <div>Hello {this.props.name}</div>;
   }
}

ReactDOM.render(
   <Test name="Toby"/>,
   document.getElementById('content')
);

