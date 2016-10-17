"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HashMap_1 = require('../../util/HashMap');
var SymTabEntryImpl = (function (_super) {
    __extends(SymTabEntryImpl, _super);
    /**
     * Constructor.
     * @param name the name of the entry.
     * @param symTab the symbol table that contains this entry.
     */
    function SymTabEntryImpl(name, symTab) {
        _super.call(this);
        this.name = name;
        this.symTab = symTab;
        this.lineNumbers = [];
    }
    /**
     * Getter.
     * @return the name of the entry.
     */
    SymTabEntryImpl.prototype.getName = function () {
        return this.name;
    };
    /**
     * Getter.
     * @return the symbol table that contains this entry.
     */
    SymTabEntryImpl.prototype.getSymTab = function () {
        return this.symTab;
    };
    /**
     * Setter.
     * @param definition the definition to set.
     */
    SymTabEntryImpl.prototype.setDefinition = function (definition) {
        this.definition = definition;
    };
    /**
     * Getter.
     * @return the definition.
     */
    SymTabEntryImpl.prototype.getDefinition = function () {
        return this.definition;
    };
    /**
     * Setter.
     * @param typeSpec the type specification to set.
     */
    SymTabEntryImpl.prototype.setTypeSpec = function (typeSpec) {
        this.typeSpec = typeSpec;
    };
    /**
     * Getter.
     * @return the type specification.
     */
    SymTabEntryImpl.prototype.getTypeSpec = function () {
        return this.typeSpec;
    };
    /**
     * Append a source line number to the entry.
     * @param lineNumber the line number to append.
     */
    SymTabEntryImpl.prototype.appendLineNumber = function (lineNumber) {
        this.lineNumbers.push(lineNumber);
    };
    /**
     * Getter.
     * @return the list of source line numbers for the entry.
     */
    SymTabEntryImpl.prototype.getLineNumbers = function () {
        return this.lineNumbers;
    };
    return SymTabEntryImpl;
}(HashMap_1.HashMap));
exports.SymTabEntryImpl = SymTabEntryImpl;
