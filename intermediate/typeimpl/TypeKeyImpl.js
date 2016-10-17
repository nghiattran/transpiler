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
    TypeKeyImpl.get = function (type) {
        return new TypeKeyImpl(TypeKeyImplEnum[type]);
    };
    TypeKeyImpl.prototype.toString = function () {
        return this.toString().toLowerCase();
    };
    return TypeKeyImpl;
}());
exports.TypeKeyImpl = TypeKeyImpl;
(function (TypeKeyImplEnum) {
    // Enumeration
    TypeKeyImplEnum[TypeKeyImplEnum["ENUMERATION_CONSTANTS"] = 0] = "ENUMERATION_CONSTANTS";
    // Subrange
    TypeKeyImplEnum[TypeKeyImplEnum["SUBRANGE_BASE_TYPE"] = 1] = "SUBRANGE_BASE_TYPE";
    TypeKeyImplEnum[TypeKeyImplEnum["SUBRANGE_MIN_VALUE"] = 2] = "SUBRANGE_MIN_VALUE";
    TypeKeyImplEnum[TypeKeyImplEnum["SUBRANGE_MAX_VALUE"] = 3] = "SUBRANGE_MAX_VALUE";
    // Array
    TypeKeyImplEnum[TypeKeyImplEnum["ARRAY_INDEX_TYPE"] = 4] = "ARRAY_INDEX_TYPE";
    TypeKeyImplEnum[TypeKeyImplEnum["ARRAY_ELEMENT_TYPE"] = 5] = "ARRAY_ELEMENT_TYPE";
    TypeKeyImplEnum[TypeKeyImplEnum["ARRAY_ELEMENT_COUNT"] = 6] = "ARRAY_ELEMENT_COUNT";
    // Record
    TypeKeyImplEnum[TypeKeyImplEnum["RECORD_SYMTAB"] = 7] = "RECORD_SYMTAB";
})(exports.TypeKeyImplEnum || (exports.TypeKeyImplEnum = {}));
var TypeKeyImplEnum = exports.TypeKeyImplEnum;
