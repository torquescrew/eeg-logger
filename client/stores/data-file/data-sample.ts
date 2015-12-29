import {Field} from "../../util/util";

interface Sample {
   eSense: {
      attention: number,
      meditation: number
   },
   eegPower: {
      delta: number,
      theta: number,
      lowAlpha: number,
      highAlpha: number,
      lowBeta: number,
      highBeta: number,
      lowGamma: number,
      highGamma: number
   },
   poorSignalLevel: number,
   time: number
}

export class DataSample {
   sample: Sample;

   constructor(sample: Sample) {
      this.sample = sample;
   }

   // This style of getter allows drawing trace with any field.
   getField(field: Field): number {
      let s = this.sample;

      switch (field) {
         case Field.Attention:
            return s.eSense.attention;
         case Field.Meditation:
            return s.eSense.meditation;
         case Field.Delta:
            return s.eegPower.delta;
         case Field.Theta:
            return s.eegPower.theta;
         case Field.LowAlpha:
            return s.eegPower.lowAlpha;
         case Field.HighAlpha:
            return s.eegPower.highAlpha;
         case Field.LowBeta:
            return s.eegPower.lowBeta;
         case Field.HighBeta:
            return s.eegPower.highBeta;
         case Field.LowGamma:
            return s.eegPower.lowGamma;
         case Field.HighGamma:
            return s.eegPower.highGamma;
         case Field.Signal:
            return this.calcSignal(s.poorSignalLevel);
         case Field.Time:
            return s.time;
      }
   }

   private calcSignal(poorSignalLevel: number): number {
      return 100 - (poorSignalLevel / 2);
   }
}