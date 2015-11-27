var fs = require('fs');
var Retranslator = require('./index');
var writable = fs.createWriteStream('file-buff.json');

var retranslator = new Retranslator({ port: 20163 });

retranslator.emitter.on('message', (msg) => {
  writable.write(JSON.stringify(msg, null, 2), { encoding: 'utf8' });
});

retranslator.start();
