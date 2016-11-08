import {Pascal} from './src/language/Pascal';
let fs = require('fs');

let text = fs.readFileSync('./test.pas', 'utf8');

Pascal.main(['compile', 'xi', text])