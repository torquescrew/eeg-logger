var _ = require('underscore');

function createFakeSample() {
   return {
      eSense: {
         attention: numBetween(0, 100),
         meditation: numBetween(0, 100)
      },
      eegPower: {
         delta: numBetween(0, 548452),
         theta: numBetween(0, 548452),
         lowAlpha: numBetween(0, 54845),
         highAlpha: numBetween(0, 54845),
         lowBeta: numBetween(0, 54845),
         highBeta: numBetween(0, 54845),
         lowGamma: numBetween(0, 5484),
         highGamma: numBetween(0, 5484)
      },
      poorSignalLevel: 0,
      time: _.now()
   }
}

function numBetween(min, max) {
   var range = max - min;

   return Math.round((Math.random() * range) + min);
}

function startEmitting(callback) {
   setInterval(function() {
      callback(createFakeSample());
   }, 1000);
}

module.exports.createFakeSample = createFakeSample;
module.exports.startEmitting = startEmitting;