"use strict";
var TypeKeyImpl = (function () {
    /**
     * Constructor.
     */
    function TypeKeyImpl(text) {
        text = text || this.toString().toLowerCase();
    }
    /**
     * Getter.
     * @return the text of the definition code.
     */
    TypeKeyImpl.prototype.getText = function () {
        return this.text;
    };
    TypeKeyImpl.prototype.toString = function () {
        return this.toString().toLowerCase();
    };
    // Enumeration
    TypeKeyImpl.ENUMERATION_CONSTANTS = new TypeKeyImpl('ENUMERATION_CONSTANTS');
    // Subrange
    TypeKeyImpl.SUBRANGE_BASE_TYPE = new TypeKeyImpl('SUBRANGE_BASE_TYPE');
    TypeKeyImpl.SUBRANGE_MIN_VALUE = new TypeKeyImpl('SUBRANGE_MIN_VALUE');
    TypeKeyImpl.SUBRANGE_MAX_VALUE = new TypeKeyImpl('SUBRANGE_MAX_VALUE');
    // Array
    TypeKeyImpl.ARRAY_INDEX_TYPE = new TypeKeyImpl('ARRAY_INDEX_TYPE');
    TypeKeyImpl.ARRAY_ELEMENT_TYPE = new TypeKeyImpl('ARRAY_ELEMENT_TYPE');
    TypeKeyImpl.ARRAY_ELEMENT_COUNT = new TypeKeyImpl('ARRAY_ELEMENT_COUNT');
    // Record
    TypeKeyImpl.RECORD_SYMTAB = new TypeKeyImpl('RECORD_SYMTAB');
    return TypeKeyImpl;
}());
exports.TypeKeyImpl = TypeKeyImpl;
