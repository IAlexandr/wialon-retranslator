var alter = require('./msg-parser');
var packet = require('fs').readFileSync('file-buff.json');

var bufTail = packet;
var data = [];
while (true) {
  var result = alter.tryParseBuffer(bufTail);
  if (!result.message) {
    break;
  } else {
    data.push(result.message);
  }
  bufTail = result.bufferTail;
}
console.log(JSON.stringify(data, null, 2));
