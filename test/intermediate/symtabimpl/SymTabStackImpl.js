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
    /**
     * Constructor.
     */
    function SymTabStackImpl() {
        _super.call(this);
        this.currentNestingLevel = 0;
        this.push(SymTabFactory_1.SymTabFactory.createSymTab(this.currentNestingLevel));
    }
    /**
     * Setter.
     * @param entry the symbol table entry for the main program identifier.
     */
    SymTabStackImpl.prototype.setProgramId = function (id) {
        this.programId = id;
    };
    /**
     * Getter.
     * @return the symbol table entry for the main program identifier.
     */
    SymTabStackImpl.prototype.getProgramId = function () {
        return this.programId;
    };
    /**
     * Getter.
     * @return the current nesting level.
     */
    SymTabStackImpl.prototype.getCurrentNestingLevel = function () {
        return this.currentNestingLevel;
    };
    /**
     * Return the local symbol table which is at the top of the stack.
     * @return the local symbol table.
     */
    SymTabStackImpl.prototype.getLocalSymTab = function () {
        return this[this.currentNestingLevel];
    };
    /**
     * Push a new symbol table onto the symbol table stack.
     * @return the pushed symbol table.
     */
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
    /**
     * Pop a symbol table off the symbol table stack.
     * @return the popped symbol table.
     */
    SymTabStackImpl.prototype.pop = function () {
        var symTab = this[this.currentNestingLevel];
        this.remove();
        this.currentNestingLevel--;
        return symTab;
    };
    /**
     * Create and enter a new entry into the local symbol table.
     * @param name the name of the entry.
     * @return the new entry.
     */
    SymTabStackImpl.prototype.enterLocal = function (name) {
        return this[this.currentNestingLevel].enter(name);
    };
    /**
     * Look up an existing symbol table entry in the local symbol table.
     * @param name the name of the entry.
     * @return the entry, or null if it does not exist.
     */
    SymTabStackImpl.prototype.lookupLocal = function (name) {
        return this[this.currentNestingLevel].lookup(name);
    };
    /**
     * Look up an existing symbol table entry throughout the stack.
     * @param name the name of the entry.
     * @return the entry, or null if it does not exist.
     */
    SymTabStackImpl.prototype.lookup = function (name) {
        var foundEntry = null;
        // Search the current and enclosing scopes.
        for (var i = this.currentNestingLevel; (i >= 0) && (foundEntry == null); --i) {
            foundEntry = this[i].lookup(name);
        }
        return foundEntry;
    };
    return SymTabStackImpl;
}(List_1.List));
exports.SymTabStackImpl = SymTabStackImpl;
