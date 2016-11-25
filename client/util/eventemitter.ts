let indexOf;

if (typeof Array.prototype.indexOf === 'function') {
   indexOf = (haystack, needle) => {
      return haystack.indexOf(needle);
   };
} else {
   indexOf = (haystack, needle) => {
      let i = 0;
      let length = haystack.length;
      let idx = -1;
      let found = false;

      while (i < length && !found) {
         if (haystack[i] === needle) {
            idx = i;
            found = true;
         }

         i++;
      }

      return idx;
   };
}

export class EventEmitter {
   events: Object = {};

   on(event, listener) {
      if (typeof this.events[event] !== 'object') {
         this.events[event] = [];
      }

      this.events[event].push(listener);
   }

   removeListener(event, listener) {
      let idx;

      if (typeof this.events[event] === 'object') {
         idx = indexOf(this.events[event], listener);

         if (idx > -1) {
            this.events[event].splice(idx, 1);
         }
      }
   }

   emit(event, ...args) {
      // let i;
      // let listeners;
      // let length;
      // let args = [].slice.call(arguments, 1);

      if (typeof this.events[event] === 'object') {
         let listeners = this.events[event].slice();
         let length = listeners.length;

         for (let i = 0; i < length; i++) {
            listeners[i].apply(this, args);
         }
      }
   }

   once(event, listener) {
      this.on(event, function g() {
         this.removeListener(event, g);
         listener.apply(this, arguments);
      });
   }

}