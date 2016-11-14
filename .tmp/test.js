"use strict";
var Pascal_1 = require('./src/language/Pascal');
var Transpiler_1 = require('./src/Transpiler');
var XMLExporter_1 = require('./src/util/export/XMLExporter');
var fs = require('fs');
var text = fs.readFileSync('./test.pas', 'utf8');
var exporter = new XMLExporter_1.XMLExporter();
var compiler = new Transpiler_1.Transpiler(new Pascal_1.Pascal());
compiler.parse(text);
console.log(compiler.export(exporter));
//# sourceMappingURL=test.js.map