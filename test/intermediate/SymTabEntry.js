"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HashMap_1 = require('../util/HashMap');
var SymTabEntry = (function (_super) {
    __extends(SymTabEntry, _super);
    /**
     * Constructor.
     * @param name the name of the entry.
     * @param symTab the symbol table that contains this entry.
     */
    function SymTabEntry(name, symTab) {
        _super.call(this);
        this.name = name;
        this.symTab = symTab;
        this.lineNumbers = [];
    }
    /**
     * Getter.
     * @return the name of the entry.
     */
    SymTabEntry.prototype.getName = function () {
        return this.name;
    };
    /**
     * Getter.
     * @return the symbol table that contains this entry.
     */
    SymTabEntry.prototype.getSymTab = function () {
        return this.symTab;
    };
    /**
     * Setter.
     * @param definition the definition to set.
     */
    SymTabEntry.prototype.setDefinition = function (definition) {
        this.definition = definition;
    };
    /**
     * Getter.
     * @return the definition.
     */
    SymTabEntry.prototype.getDefinition = function () {
        return this.definition;
    };
    /**
     * Setter.
     * @param typeSpec the type specification to set.
     */
    SymTabEntry.prototype.setTypeSpec = function (typeSpec) {
        this.typeSpec = typeSpec;
    };
    /**
     * Getter.
     * @return the type specification.
     */
    SymTabEntry.prototype.getTypeSpec = function () {
        return this.typeSpec;
    };
    /**
     * Append a source line number to the entry.
     * @param lineNumber the line number to append.
     */
    SymTabEntry.prototype.appendLineNumber = function (lineNumber) {
        this.lineNumbers.push(lineNumber);
    };
    /**
     * Getter.
     * @return the list of source line numbers for the entry.
     */
    SymTabEntry.prototype.getLineNumbers = function () {
        return this.lineNumbers;
    };
    return SymTabEntry;
}(HashMap_1.HashMap));
exports.SymTabEntry = SymTabEntry;
