"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HashMap_1 = require('../util/HashMap');
var SymTabEntry = (function (_super) {
    __extends(SymTabEntry, _super);
    function SymTabEntry(name, symTab) {
        _super.call(this);
        this.name = name;
        this.symTab = symTab;
        this.lineNumbers = [];
    }
    SymTabEntry.prototype.getName = function () {
        return this.name;
    };
    SymTabEntry.prototype.getSymTab = function () {
        return this.symTab;
    };
    SymTabEntry.prototype.setDefinition = function (definition) {
        this.definition = definition;
    };
    SymTabEntry.prototype.getDefinition = function () {
        return this.definition;
    };
    SymTabEntry.prototype.setTypeSpec = function (typeSpec) {
        this.typeSpec = typeSpec;
    };
    SymTabEntry.prototype.getTypeSpec = function () {
        return this.typeSpec;
    };
    SymTabEntry.prototype.appendLineNumber = function (lineNumber) {
        this.lineNumbers.push(lineNumber);
    };
    SymTabEntry.prototype.getLineNumbers = function () {
        return this.lineNumbers;
    };
    return SymTabEntry;
}(HashMap_1.HashMap));
exports.SymTabEntry = SymTabEntry;
//# sourceMappingURL=SymTabEntry.js.map