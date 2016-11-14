"use strict";
var Compiler = (function () {
    function Compiler(languageName) {
        this.languageName = languageName;
    }
    Compiler.prototype.setSource = function (source) {
        this.source = source;
        this.scanner.setSource(this.source);
    };
    Compiler.prototype.getParser = function () {
        return this.parser;
    };
    return Compiler;
}());
exports.Compiler = Compiler;
//# sourceMappingURL=Compiler.js.map