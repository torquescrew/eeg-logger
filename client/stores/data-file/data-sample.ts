export class DataSample {
   sample: any;

   constructor(sample) {
      this.sample = sample;
   }

   getSignal(): number {
      let poorSignalLevel = this.sample['poorSignalLevel'];
      return 100 - (poorSignalLevel / 2);
   }

   getAttention(): number {
      return this.sample['eSense']['attention'];
   }

   getMeditation(): number {
      return this.sample['eSense']['meditation'];
   }

   getTime(): number {
      return this.sample['time'];
   }
}