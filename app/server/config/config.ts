import * as appArgs from './app-args';


export function getAppMode() {
   return {
      debug: appArgs.devMode,
      fakeData: false,
      saveRecordedData: true
   }
}