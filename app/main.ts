import {initWindow} from "./client/electron-main";
import {startServer} from "./server/server";
import {MuseManager} from "./server/muse/muse-manager";
//

export function main() {
   // startServer();
   // initWindow();

   const headset = new MuseManager();
   headset.connect();
}
main();




