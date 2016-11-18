import {Pascal} from './src/language/Pascal';
import {CrossReferencer} from './src/util/CrossReferencer';
import {Transpiler} from './src/Transpiler';
import {JsonExporter} from './src/util/export/JsonExporter';
import {XMLExporter} from './src/util/export/XMLExporter';

let fs = require('fs');

let text = fs.readFileSync('./test.pas', 'utf8');

let exporter = new XMLExporter();
let compiler = new Transpiler(new Pascal());
compiler.parse(text);
console.log(compiler.export(exporter));