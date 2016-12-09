import {initWindow} from "./client/electron-main";
// import {startServer} from "./server/muse/osc-server";
import {startServer} from "./server/server";
//

export function main() {
   // startServer();
   startServer();
   initWindow();
}
main();




