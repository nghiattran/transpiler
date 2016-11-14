"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require('../../util/BaseObject');
var TypeKeyImpl = (function (_super) {
    __extends(TypeKeyImpl, _super);
    function TypeKeyImpl(text) {
        _super.call(this);
        text = text || this.toString().toLowerCase();
    }
    TypeKeyImpl.prototype.getText = function () {
        return this.text;
    };
    TypeKeyImpl.prototype.toString = function () {
        return this.toString().toLowerCase();
    };
    TypeKeyImpl.ENUMERATION_CONSTANTS = new TypeKeyImpl('ENUMERATION_CONSTANTS');
    TypeKeyImpl.SUBRANGE_BASE_TYPE = new TypeKeyImpl('SUBRANGE_BASE_TYPE');
    TypeKeyImpl.SUBRANGE_MIN_VALUE = new TypeKeyImpl('SUBRANGE_MIN_VALUE');
    TypeKeyImpl.SUBRANGE_MAX_VALUE = new TypeKeyImpl('SUBRANGE_MAX_VALUE');
    TypeKeyImpl.ARRAY_INDEX_TYPE = new TypeKeyImpl('ARRAY_INDEX_TYPE');
    TypeKeyImpl.ARRAY_ELEMENT_TYPE = new TypeKeyImpl('ARRAY_ELEMENT_TYPE');
    TypeKeyImpl.ARRAY_ELEMENT_COUNT = new TypeKeyImpl('ARRAY_ELEMENT_COUNT');
    TypeKeyImpl.RECORD_SYMTAB = new TypeKeyImpl('RECORD_SYMTAB');
    return TypeKeyImpl;
}(BaseObject_1.BaseObject));
exports.TypeKeyImpl = TypeKeyImpl;
//# sourceMappingURL=TypeKeyImpl.js.map