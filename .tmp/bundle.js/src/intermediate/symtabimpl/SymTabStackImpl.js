"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SymTabFactory_1 = require('../SymTabFactory');
var List_1 = require('../../util/List');
var SymTabStackImpl = (function (_super) {
    __extends(SymTabStackImpl, _super);
    function SymTabStackImpl() {
        _super.call(this);
        this.currentNestingLevel = 0;
        this.add(SymTabFactory_1.SymTabFactory.createSymTab(this.currentNestingLevel));
    }
    SymTabStackImpl.prototype.setProgramId = function (id) {
        this.programId = id;
    };
    SymTabStackImpl.prototype.getProgramId = function () {
        return this.programId;
    };
    SymTabStackImpl.prototype.getCurrentNestingLevel = function () {
        return this.currentNestingLevel;
    };
    SymTabStackImpl.prototype.getLocalSymTab = function () {
        return this.get(this.currentNestingLevel);
    };
    SymTabStackImpl.prototype.push = function (symTab) {
        if (symTab) {
            ++this.currentNestingLevel;
        }
        else {
            symTab = SymTabFactory_1.SymTabFactory.createSymTab(++this.currentNestingLevel);
        }
        this.add(symTab);
        return symTab;
    };
    SymTabStackImpl.prototype.pop = function () {
        var symTab = this.get(this.currentNestingLevel);
        this.removeIndex(this.currentNestingLevel--);
        return symTab;
    };
    SymTabStackImpl.prototype.enterLocal = function (name) {
        return this.get(this.currentNestingLevel).enter(name);
    };
    SymTabStackImpl.prototype.lookupLocal = function (name) {
        return this.get(this.currentNestingLevel).lookup(name);
    };
    SymTabStackImpl.prototype.lookup = function (name) {
        var foundEntry = undefined;
        for (var i = this.currentNestingLevel; (i >= 0) && (foundEntry === undefined); --i) {
            foundEntry = this.get(i).lookup(name);
        }
        return foundEntry;
    };
    return SymTabStackImpl;
}(List_1.List));
exports.SymTabStackImpl = SymTabStackImpl;
//# sourceMappingURL=SymTabStackImpl.js.map