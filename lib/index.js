import net from 'net';

let bufTail;
let isFirst = true;
let packetSize = 0;
let handle = 0;

function getMessage (buf) {
  let isDone = false;
  
  const bufSize = buf.length;
  const message = {};
  // TODO peredelat' uslovie if (nevernoe, nujno ne bufSize)
  if (bufSize < packetSize) {
    isDone = true;
  } else {
    const controllerIdByteEndIndex = buf.indexOf(0x00, handle);
    message.controllerId = buf.slice(handle, controllerIdByteEndIndex);
    console.log('contrIdByteEndIndex ', controllerIdByteEndIndex, ' controllerId ', message.controllerId.toString());    
    // handle += controllerIdByteEndIndex;
    // TODO parse some props;
    //handle += packetSize; // vremenno 
  }
   
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
      console.log('data');
      if (isFirst) {
        packetSize = buffer.readIntLE(0, 4);
        handle = 4;
      }
      if (bufTail) {
        bufTail = concatBuf([bufTail, buffer]);
      } else {
        bufTail = buffer;
      }
      let data = [];
      let isDone = false;
      //do {
      //  const res = getMessage(bufTail);
      //  data.concat(res.message);
      //  isDone = res.isDone;
      //} while (!isDone);

      //const packetSize =  buffer.readIntLE(0, 4);
      //const actualSize = buffer.length;
      //console.log('got data>', buffer.toString());
      //console.log('size in packet', packetSize);
      //console.log('size actual', actualSize);
      //console.log('head:', buffer.slice(0, 4));
      c.write(new Buffer([0x11]));
      //console.log('sent response');
      writable.write(buffer);
      console.log('----');
    });
  });

  server.listen(port, function () {
    console.log('server lisetning.');
  });
}
