import * as React from 'react';


export class Btn extends React.Component<{
   onClick?: any,
   text: string,
   hide?: boolean,
   classes?: string[],
   additionalClasses?: string[],
   disabled?: boolean
}, {}> {

   static defaultProps = {
      onClick: () => { console.log('does nothing'); },
      test: 'todo',
      hide: false,
      classes: ['btn', 'disable-select'],
      additionalClasses: []
   };

   getClasses(): string {
      var classes = this.props.classes.concat(this.props.additionalClasses);

      if (this.props.disabled) {
         classes.push('disabled');
      }

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
