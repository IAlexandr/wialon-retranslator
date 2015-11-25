var alter = require('./alter');
var packet = require('fs').readFileSync('packet.bin');

var result = alter.tryParseBuffer(packet);
console.log(result);
