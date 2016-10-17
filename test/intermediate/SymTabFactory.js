"use strict";
var SymTabStackImpl_1 = require("./symtabimpl/SymTabStackImpl");
var SymTabEntryImpl_1 = require("./symtabimpl/SymTabEntryImpl");
var SymTabImpl_1 = require("./symtabimpl/SymTabImpl");
var SymTabFactory = (function () {
    function SymTabFactory() {
    }
    /**
     * Create and return a symbol table stack implementation.
     * @return the symbol table implementation.
     */
    SymTabFactory.createSymTabStack = function () {
        return new SymTabStackImpl_1.SymTabStackImpl();
    };
    /**
     * Create and return a symbol table implementation.
     * @param nestingLevel the nesting level.
     * @return the symbol table implementation.
     */
    SymTabFactory.createSymTab = function (nestingLevel) {
        return new SymTabImpl_1.SymTabImpl(nestingLevel);
    };
    /**
     * Create and return a symbol table entry implementation.
     * @param name the identifier name.
     * @param symTab the symbol table that contains this entry.
     * @return the symbol table entry implementation.
     */
    SymTabFactory.createSymTabEntry = function (name, symTab) {
        return new SymTabEntryImpl_1.SymTabEntryImpl(name, symTab);
    };
    return SymTabFactory;
}());
exports.SymTabFactory = SymTabFactory;
