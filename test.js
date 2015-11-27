var fs = require('fs');
var retranslator = require('./index');
var writable = fs.createWriteStream('file-buff.json');

var EE = retranslator({ port: 20163 });

EE.on('message', (msg) => { 
  writable.write(JSON.stringify(msg, null, 2), { encoding: 'utf8' });
});
