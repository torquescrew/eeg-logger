import * as React from 'react';


export class Btn extends React.Component<{
   onClick: any,
   text: string,
   hide?: boolean,
   classes?: string[]
}, {}> {

   static defaultProps = {
      onClick: () => { console.log('does nothing'); },
      test: 'todo',
      hide: false,
      classes: ['btn', 'disable-select']
   };

   //getDefaultProps() {
   //   return {
   //      onClick: () => { console.log('does nothing'); },
   //      test: 'todo',
   //      hide: false,
   //      classes: ['btn', 'disable-select']
   //   };
   //}

   getClasses(): string {
      var classes = this.props.classes;

      if (this.props.hide) {
         return classes.concat('hide').join(' ');
      }
      return classes.join(' ');
   }

   render() {
      return (
         <div className={this.getClasses()}
              onClick={this.props.onClick}>
            {this.props.text}
         </div>
      )
   }
}

//Btn.defaultProps = {
//   onClick: () => { console.log('does nothing'); },
//   test: 'todo',
//   hide: false,
//   classes: ['btn', 'disable-select']
//};
