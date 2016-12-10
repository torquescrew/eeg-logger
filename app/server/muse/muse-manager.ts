import {HeadsetManager} from "../headset";
// import {startServer} from "./osc-server";
import {startMuseIo, startServer} from "./muse-io";
import {getFreePort} from "../util/util";


export class MuseManager implements HeadsetManager {

   async connect() {

      const port = await getFreePort(5000);

      startServer(port);

      startMuseIo('Muse-1642', port);
   }

   isConnected(): boolean {
      return false;
   }

   startRecording(): void {

   }

   stopRecording(): void {

   }

   getRecordedData(): any[] {
      return [];
   }

}

