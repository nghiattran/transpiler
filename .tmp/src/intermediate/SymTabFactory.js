"use strict";
var SymTabStackImpl_1 = require("./symtabimpl/SymTabStackImpl");
var SymTabEntryImpl_1 = require("./symtabimpl/SymTabEntryImpl");
var SymTabImpl_1 = require("./symtabimpl/SymTabImpl");
var SymTabFactory = (function () {
    function SymTabFactory() {
    }
    SymTabFactory.createSymTabStack = function () {
        return new SymTabStackImpl_1.SymTabStackImpl();
    };
    SymTabFactory.createSymTab = function (nestingLevel) {
        return new SymTabImpl_1.SymTabImpl(nestingLevel);
    };
    SymTabFactory.createSymTabEntry = function (name, symTab) {
        return new SymTabEntryImpl_1.SymTabEntryImpl(name, symTab);
    };
    return SymTabFactory;
}());
exports.SymTabFactory = SymTabFactory;
//# sourceMappingURL=SymTabFactory.js.map