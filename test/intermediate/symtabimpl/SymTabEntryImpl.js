"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SymTabEntry_1 = require('../SymTabEntry');
var SymTabEntryImpl = (function (_super) {
    __extends(SymTabEntryImpl, _super);
    /**
     * Constructor.
     * @param name the name of the entry.
     * @param symTab the symbol table that contains this entry.
     */
    function SymTabEntryImpl(name, symTab) {
        _super.call(this, name, symTab);
    }
    return SymTabEntryImpl;
}(SymTabEntry_1.SymTabEntry));
exports.SymTabEntryImpl = SymTabEntryImpl;
