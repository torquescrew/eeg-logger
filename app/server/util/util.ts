import * as net from 'net';


export async function getFreePort(port: number) {
   while (await isPortTaken(port)) {
      port++;
   }
   return port;
}

export function isPortTaken(port: number): Promise<boolean> {
   return new Promise((resolve, reject) => {
      const tempServer = net.createServer()
         .once('error', (err: Error) => {
            if (err['code'] !== 'EADDRINUSE') {
               reject(err);
            }
            resolve(true);
         })
         .once('listening', () => {
            tempServer.once('close', () => {
               resolve(false)
            }).close();
         }).listen(port);
   });
}