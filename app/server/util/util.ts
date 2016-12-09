import * as net from 'net';


// export function isPortTaken(port: number, callback: Function) {
//    const tempServer = net.createServer()
//       .once('error', (err: Error) => {
//          if (err['code'] !== 'EADDRINUSE') {
//             return callback(err);
//          }
//
//          callback(null, true);
//       })
//       .once('listening', () => {
//          tempServer.once('close', () => {
//             callback(null, false)
//          }).close();
//       }).listen(port);
//
// }

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