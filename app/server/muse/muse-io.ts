import {spawn} from 'child_process';
import * as net from "net";
import {Socket, Server} from "net";

const osc = require('osc-min');


interface OscMsg {
   address: string;
   args: { type: string; value: number; }[];
   oscType: string;
}

let server: Server = null;

export async function startServer(port: number) {
   server = net.createServer((socket: Socket) => {
      socket.end('goodbye\n');

      socket.on('data', (data) => {

         let msg;

         try {
            msg = osc.fromBuffer(data);
         } catch (error) {
            // console.log("An error occurred: ", error.message);
         }

         parseMuseMsg(msg);
      });

   }).on('error', (err) => {
      // handle errors here
      throw err;
   });

   // const port = await getFreePort(5000);

   server.listen(port, () => {
      console.log('opened server on', server.address());
   });

}

function parseMuseMsg(msg): OscMsg | null {
   if (msg.address && msg.address !== '') {

      return msg as OscMsg;
   }
   return null;
}

export function stopServer() {
   if (server) {
      server.close();
   }
}

export function startMuseIo(deviceId: string, port: number) {
   process.env.DYLD_LIBRARY_PATH = '/Applications/Muse/';

   const ls = spawn(
      'muse-io',
      ['--device', deviceId, '--osc', `osc.tcp://localhost:${port}`], {
         env: process.env,
         cwd: process.cwd()
   });

   ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
   });

   ls.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
   });

   ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
   });
}



