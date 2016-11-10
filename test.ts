import {Pascal} from './src/language/Pascal';
import {CrossReferencer} from './src/util/CrossReferencer';
import {Transpiler} from './src/Transpiler';
import {JsonExporter} from './src/util/export/JsonExporter';

let fs = require('fs');

let text = fs.readFileSync('./test.pas', 'utf8');

let exporter = new JsonExporter();
let compiler = new Transpiler(new Pascal());

compiler.parse(text);


fs.writeFileSync('export.json', JSON.stringify(compiler.export(exporter), null, 4));