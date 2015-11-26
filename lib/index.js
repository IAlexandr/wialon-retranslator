import net from 'net';
import msgParser from './msg-parser';

let bufTail;
const controllerList = {};

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
      console.log('packet! length:', buffer.length);
      if (bufTail) {
        console.log('concatBuf: [', bufTail.length, buffer.length, ']');
        bufTail = concatBuf([bufTail, buffer]);
        console.log('concatBuf result bufTail: ', bufTail.length);
      } else {
        bufTail = buffer;
      }
      const data = [];
      while (true) {
        var result = msgParser.tryParseBuffer(bufTail);
        bufTail = result.bufferTail;
        if (!result.message) {
          break;
        } else {
          const cId = result.message.controllerId;
          if (controllerList[cId]) {
            controllerList[cId] += 1;
          } else {
            controllerList[cId] = 1;
          }
          data.push(result.message);
        }
      }
      writable.write(JSON.stringify(data, null, 2), {encoding: 'utf8'});
      console.log('data.length:', data.length);
      console.log('bufTail.length: ', bufTail.length);
      console.log(JSON.stringify(controllerList, null, 2));
      console.log('----');
      c.write(new Buffer([0x11]));
    });
  });

  server.listen(port, function () {
    console.log('server lisetning.');
  });
}
