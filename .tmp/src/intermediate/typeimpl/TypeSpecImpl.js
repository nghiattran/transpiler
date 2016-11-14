"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HashMap_1 = require('../../util/HashMap');
var Predefined_1 = require('../symtabimpl/Predefined');
var TypeKeyImpl_1 = require('./TypeKeyImpl');
var TypeFormImpl_1 = require('./TypeFormImpl');
var TypeSpecImpl = (function (_super) {
    __extends(TypeSpecImpl, _super);
    function TypeSpecImpl(value) {
        _super.call(this);
        if (value instanceof TypeFormImpl_1.TypeFormImpl) {
            this.formConstructor(value);
        }
        else if (typeof value === 'string' || value instanceof String) {
            this.stringConstructor(value);
        }
        else {
            throw "Type not covered";
        }
    }
    TypeSpecImpl.prototype.formConstructor = function (form) {
        this.form = form;
        this.identifier = undefined;
    };
    TypeSpecImpl.prototype.stringConstructor = function (value) {
        this.form = TypeFormImpl_1.TypeFormImpl.ARRAY;
        var indexType = new TypeSpecImpl(TypeFormImpl_1.TypeFormImpl.SUBRANGE);
        indexType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_BASE_TYPE, Predefined_1.Predefined.integerType);
        indexType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_MIN_VALUE, 1);
        indexType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_MAX_VALUE, value.length);
        this.setAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_INDEX_TYPE, indexType);
        this.setAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_ELEMENT_TYPE, Predefined_1.Predefined.charType);
        this.setAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_ELEMENT_COUNT, value.length);
    };
    TypeSpecImpl.prototype.getForm = function () {
        return this.form;
    };
    TypeSpecImpl.prototype.setIdentifier = function (identifier) {
        this.identifier = identifier;
    };
    TypeSpecImpl.prototype.getIdentifier = function () {
        return this.identifier;
    };
    TypeSpecImpl.prototype.isPascalString = function () {
        if (this.form === TypeFormImpl_1.TypeFormImpl.ARRAY) {
            var elmtType = this.getAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_ELEMENT_TYPE);
            var indexType = this.getAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_INDEX_TYPE);
            return (elmtType.baseType() === Predefined_1.Predefined.charType) &&
                (indexType.baseType() === Predefined_1.Predefined.integerType);
        }
        else {
            return false;
        }
    };
    TypeSpecImpl.prototype.baseType = function () {
        return this.form === TypeFormImpl_1.TypeFormImpl.SUBRANGE ? this.getAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_BASE_TYPE)
            : this;
    };
    TypeSpecImpl.prototype.toJson = function () {
        return {
            form: this.form.toString(),
            indentifier: this.identifier ? this.identifier.getName() : undefined
        };
    };
    return TypeSpecImpl;
}(HashMap_1.HashMap));
exports.TypeSpecImpl = TypeSpecImpl;
//# sourceMappingURL=TypeSpecImpl.js.map