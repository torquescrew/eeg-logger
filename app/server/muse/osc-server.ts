import * as net from "net";
import {Socket, Server} from "net";
import {getFreePort} from "../util/util";
const osc = require('osc-min');


let server: Server = null;

export async function startServer() {
   server = net.createServer((socket: Socket) => {
      socket.end('goodbye\n');

      socket.on('data', (data) => {

         let msg;

         try {
            msg = osc.fromBuffer(data);
         } catch (error) {
            // console.log("An error occurred: ", error.message);
         }

         console.log(msg);
      });

   }).on('error', (err) => {
      // handle errors here
      throw err;
   });

   const port = await getFreePort(5000);

   server.listen(port, () => {
      console.log('opened server on', server.address());
   });

}

export function stopServer() {
   if (server) {
      server.close();
   }
}


