import net from 'net';

export default function retranslator (options) {
  const { port, writable } = options;
  const server = net.createServer(function (c) {
    c.on('data', function (buffer) {
      const packetSize =  buffer.readIntLE(0, 4);
      const actualSize = buffer.length;
       console.log('got data>', buffer.toString());
      console.log('size in packet', packetSize);
      console.log('size actual', actualSize);
      console.log('head:', buffer.slice(0, 4));
      c.write(new Buffer([0x11]));
      console.log('sent response');
      writable.write(buffer);
      console.log('----');
    });
  });

  server.listen(port, function () {
    console.log('server lisetning.');
  });
}
