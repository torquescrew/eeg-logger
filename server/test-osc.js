const osc = require('osc-min');
const net = require('net');


const server = net.createServer((socket) => {
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
