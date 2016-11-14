"use strict";
var Pascal_1 = require('./src/language/Pascal');
var Transpiler_1 = require('./src/Transpiler');
var JsonExporter_1 = require('./src/util/export/JsonExporter');
var fs = require('fs');
var text = fs.readFileSync('./test.pas', 'utf8');
var exporter = new JsonExporter_1.JsonExporter();
var compiler = new Transpiler_1.Transpiler(new Pascal_1.Pascal());
compiler.parse(text);
compiler.export(exporter);
//# sourceMappingURL=test.js.map