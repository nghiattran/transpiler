"use strict";
var SymTabKeyImpl_1 = require('../../intermediate/symtabimpl/SymTabKeyImpl');
var JsonExporter = (function () {
    function JsonExporter() {
    }
    JsonExporter.prototype.export = function (symTabStack) {
        var programId = symTabStack.getProgramId();
        var definition = programId.getDefinition();
        var iCode = programId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_ICODE);
        return {
            definition: definition.toString(),
            name: programId.getName(),
            program: iCode.getRoot().toJson()
        };
    };
    return JsonExporter;
}());
exports.JsonExporter = JsonExporter;
//# sourceMappingURL=JsonExporter.js.map