"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require('../../util/BaseObject');
var TypeFormImpl = (function (_super) {
    __extends(TypeFormImpl, _super);
    function TypeFormImpl(text) {
        _super.call(this);
        this.text = text || this.toString().toLowerCase();
    }
    TypeFormImpl.prototype.getText = function () {
        return this.text;
    };
    TypeFormImpl.prototype.toString = function () {
        return this.getText().toLowerCase();
    };
    TypeFormImpl.SCALAR = new TypeFormImpl('SCALAR');
    TypeFormImpl.ENUMERATION = new TypeFormImpl('ENUMERATION');
    TypeFormImpl.SUBRANGE = new TypeFormImpl('SUBRANGE');
    TypeFormImpl.ARRAY = new TypeFormImpl('ARRAY');
    TypeFormImpl.RECORD = new TypeFormImpl('RECORD');
    return TypeFormImpl;
}(BaseObject_1.BaseObject));
exports.TypeFormImpl = TypeFormImpl;
//# sourceMappingURL=TypeFormImpl.js.map