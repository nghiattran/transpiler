"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HashMap_1 = require('../../util/HashMap');
var SymTabFactory_1 = require('../SymTabFactory');
var SymTabImpl = (function (_super) {
    __extends(SymTabImpl, _super);
    /**
     * Constructor.
     * @param nestingLevel the nesting level of this entry.
     */
    function SymTabImpl(nestingLevel) {
        _super.call(this);
        this.nestingLevel = nestingLevel;
        this.slotNumber = -1;
        this.maxSlotNumber = 0;
    }
    /**
     * Getter.
     * @return the scope nesting level of this entry.
     */
    SymTabImpl.prototype.getNestingLevel = function () {
        return this.nestingLevel;
    };
    /**
     * Create and enter a new entry into the symbol table.
     * @param name the name of the entry.
     * @return the new entry.
     */
    SymTabImpl.prototype.enter = function (name) {
        var entry = SymTabFactory_1.SymTabFactory.createSymTabEntry(name, this);
        this.put(name, entry);
        return entry;
    };
    /**
     * Look up an existing symbol table entry.
     * @param name the name of the entry.
     * @return the entry, or null if it does not exist.
     */
    SymTabImpl.prototype.lookup = function (name) {
        return this.get(name);
    };
    /**
     * @return a list of symbol table entries sorted by name.
     */
    SymTabImpl.prototype.sortedEntries = function () {
        // Collection<SymTabEntry> entries = values();
        // Iterator<SymTabEntry> iter = entries.iterator();
        // ArrayList<SymTabEntry> list = new ArrayList<SymTabEntry>(size());
        // // Iterate over the sorted entries and append them to the list.
        // while (iter.hasNext()) {
        //     list.add(iter.next());
        // }
        return []; // sorted list of entries
    };
    /**
     * @return the next local variables array slot number.
     */
    SymTabImpl.prototype.nextSlotNumber = function () {
        this.maxSlotNumber = ++this.slotNumber;
        return this.slotNumber;
    };
    /**
     * @return the maximum local variables array slot number.
     */
    SymTabImpl.prototype.getMaxSlotNumber = function () {
        return this.maxSlotNumber;
    };
    return SymTabImpl;
}(HashMap_1.HashMap));
exports.SymTabImpl = SymTabImpl;
