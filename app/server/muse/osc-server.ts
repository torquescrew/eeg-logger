import * as net from "net";
import {Socket, Server} from "net";
const osc = require('osc-min');


let server: Server = null;

export function startServer() {
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


   server.listen(5000, () => {
      console.log('opened server on', server.address());
   });


}

export function stopServer() {
   if (server) {
      server.close();
   }
}


