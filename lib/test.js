import fs from 'fs';
import retranslator from './index';

const writable = fs.createWriteStream('file-buff.json');


const EE = retranslator({ port: 20163 });

EE.on('message', (msg) => { 
  writable.write(JSON.stringify(msg, null, 2), { encoding: 'utf8' });
});
