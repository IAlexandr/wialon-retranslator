import net from 'net';

let buffTail = [];
let isFirst = true;
let packetSize = 0;
let handle = 0;

function getMessage (buf) {
  let isDone = false;
  const bufSize = buf.length;
  const message = {};
  // TODO prep message
  
  return { message, isDone };
}

function concatBuf (bufArr) {
  let totalLength = 0;
  bufArr.forEach((b) => {
    totalLength += b.length;
  });
  return Buffer.concat(bufArr, totalLength);
}

export default function retranslator (options) {
  const { port, writable } = options;
  const server = net.createServer(function (c) {
    c.on('data', function (buffer) {
      if (isFirst) {
        packetSize = buffer.readIntLE(0, 4);
      }
      bufTail = concatBuf([bufTail, buffer]);
      let data = [];
      do {
        res = getMessage(bufTail);
        data.concat(res.message);
      } while (!res.isDone);

      const packetSize =  buffer.readIntLE(0, 4);
      const actualSize = buffer.length;
      //console.log('got data>', buffer.toString());
      //console.log('size in packet', packetSize);
      //console.log('size actual', actualSize);
      //console.log('head:', buffer.slice(0, 4));
      c.write(new Buffer([0x11]));
      //console.log('sent response');
      writable.write(JSON.stringify(data));
      console.log('----');
    });
  });

  server.listen(port, function () {
    console.log('server lisetning.');
  });
}
