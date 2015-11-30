import net from 'net';
import msgParser from './msg-parser';
import events from 'events';

let bufTail;
const controllerList = {};

function concatBuf (bufArr) {
  let totalLength = 0;
  bufArr.forEach((b) => {
    totalLength += b.length;
  });
  return Buffer.concat(bufArr, totalLength);
}

export default class Retranslator {

  constructor (options) {
    const { port } = options;
    this.emitter = new events.EventEmitter();
    this.port = port;
    this.server = net.createServer(this.socket.bind(this));
  }

  start () {
    const _this = this;
    _this.server.listen(_this.port, () => {
      console.log('server lisetning.');
    });
  }

  stop (callback) {
    this.server.close(() => {
      console.log('server closed.');
      return callback();
    });
  }

  socket (c) {
    const _this = this;
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
          _this.emitter.emit('message', result.message);
        }
      }
      // writable.write(JSON.stringify(data, null, 2), {encoding: 'utf8'});
      console.log('data.length:', data.length);
      console.log('bufTail.length: ', bufTail.length);
      console.log(JSON.stringify(controllerList, null, 2));
      console.log('----');
      c.write(new Buffer([0x11]));
    });
  }

}
