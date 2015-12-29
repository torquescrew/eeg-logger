import * as React from 'react';
import * as _ from 'underscore';

import {dispatcher, Ev} from '../util/dispatcher';
import {Field, getFieldNames} from "../util/util";


export class SettingsScreen extends React.Component<{
   visibleStripes: Field[]
}, {}> {

   //TODO: Make field choices settings a component
   containsField = (fieldName: string): boolean => {
      return _.contains(this.props.visibleStripes, Field[fieldName]);
   };

   onClickFieldChoice = (fieldName) => {
      if (this.containsField(fieldName)) {
         dispatcher.emit(Ev.SetFieldVisibility, {field: Field[fieldName], visible: false});
      }
      else {
         dispatcher.emit(Ev.SetFieldVisibility, {field: Field[fieldName], visible: true});
      }
   };

   renderFieldChoices() {
      let fieldNames = getFieldNames(); //TODO: Use a specified list of enums instead.

      let fields = fieldNames.map((f) => {
         return (
            <div className="showField" key={f}>
               <div className="label">{f}</div>
               <div className="checkbox">
                  <input type="checkbox"
                         value="None"
                         id={f}
                         name="check"
                         defaultChecked={this.containsField(f)}
                         onClick={this.onClickFieldChoice.bind(this, f)} />
                  <label htmlFor={f} />
               </div>
            </div>
         );
      });

      return (
         <div className="showFields">
            <div className="title">Display fields</div>
            <div>
               {fields}
            </div>
         </div>
      )
   }

   render() {
      return (
         <div className="settings">
            {this.renderFieldChoices()}
         </div>
      );
   }
}
