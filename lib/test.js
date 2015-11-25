import fs from 'fs';
import retranslator from './index';

var writable = fs.createWriteStream('file.json');
retranslator({ port: 20163, writable });
