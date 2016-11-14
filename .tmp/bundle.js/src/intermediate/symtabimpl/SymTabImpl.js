"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TreeMap_1 = require('../../util/TreeMap');
var SymTabFactory_1 = require('../SymTabFactory');
var SymTabImpl = (function (_super) {
    __extends(SymTabImpl, _super);
    function SymTabImpl(nestingLevel) {
        _super.call(this);
        this.nestingLevel = nestingLevel;
        this.slotNumber = -1;
        this.maxSlotNumber = 0;
    }
    SymTabImpl.prototype.getNestingLevel = function () {
        return this.nestingLevel;
    };
    SymTabImpl.prototype.enter = function (name) {
        var entry = SymTabFactory_1.SymTabFactory.createSymTabEntry(name, this);
        _super.prototype.put.call(this, name, entry);
        return entry;
    };
    SymTabImpl.prototype.lookup = function (name) {
        return this.get(name);
    };
    SymTabImpl.prototype.sortedEntries = function () {
        return this.toList();
    };
    SymTabImpl.prototype.nextSlotNumber = function () {
        this.maxSlotNumber = ++this.slotNumber;
        return this.slotNumber;
    };
    SymTabImpl.prototype.getMaxSlotNumber = function () {
        return this.maxSlotNumber;
    };
    return SymTabImpl;
}(TreeMap_1.TreeMap));
exports.SymTabImpl = SymTabImpl;
//# sourceMappingURL=SymTabImpl.js.map