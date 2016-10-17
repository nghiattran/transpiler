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
        if (typeof value === 'TypeForm') {
            this.formConstructor(value);
        }
        else if (typeof value === 'string') {
            this.stringConstructor(value);
        }
        else {
            throw "Type not covered";
        }
    }
    /**
     * Constructor.
     * @param form the type form.
     */
    TypeSpecImpl.prototype.formConstructor = function (form) {
        this.form = form;
        this.identifier = null;
    };
    /**
     * Constructor.
     * @param value a string value.
     */
    TypeSpecImpl.prototype.stringConstructor = function (value) {
        this.form = TypeFormImpl_1.TypeFormImpl.get(TypeFormImpl_1.TypeFormImplEnum.ARRAY);
        var indexType = new TypeSpecImpl(TypeFormImpl_1.TypeFormImpl.get(TypeFormImpl_1.TypeFormImplEnum.SUBRANGE));
        indexType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.get(TypeKeyImpl_1.TypeKeyImplEnum.SUBRANGE_BASE_TYPE), Predefined_1.Predefined.integerType);
        indexType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.get(TypeKeyImpl_1.TypeKeyImplEnum.SUBRANGE_MIN_VALUE), 1);
        indexType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.get(TypeKeyImpl_1.TypeKeyImplEnum.SUBRANGE_MAX_VALUE), value.length);
        this.setAttribute(TypeKeyImpl_1.TypeKeyImpl.get(TypeKeyImpl_1.TypeKeyImplEnum.ARRAY_INDEX_TYPE), indexType);
        this.setAttribute(TypeKeyImpl_1.TypeKeyImpl.get(TypeKeyImpl_1.TypeKeyImplEnum.ARRAY_ELEMENT_TYPE), Predefined_1.Predefined.charType);
        this.setAttribute(TypeKeyImpl_1.TypeKeyImpl.get(TypeKeyImpl_1.TypeKeyImplEnum.ARRAY_ELEMENT_COUNT), value.length);
    };
    /**
     * Getter
     * @return the type form.
     */
    TypeSpecImpl.prototype.getForm = function () {
        return this.form;
    };
    /**
     * Setter.
     * @param identifier the type identifier (symbol table entry).
     */
    TypeSpecImpl.prototype.setIdentifier = function (identifier) {
        this.identifier = identifier;
    };
    /**
     * Getter.
     * @return the type identifier (symbol table entry).
     */
    TypeSpecImpl.prototype.getIdentifier = function () {
        return this.identifier;
    };
    /**
     * @return true if this is a Pascal string type.
     */
    TypeSpecImpl.prototype.isPascalString = function () {
        if (this.form === TypeFormImpl_1.TypeFormImpl.get(TypeFormImpl_1.TypeFormImplEnum.ARRAY)) {
            var elmtType = this.getAttribute(TypeKeyImpl_1.TypeKeyImpl.get(TypeKeyImpl_1.TypeKeyImplEnum.ARRAY_ELEMENT_TYPE));
            var indexType = this.getAttribute(TypeKeyImpl_1.TypeKeyImpl.get(TypeKeyImpl_1.TypeKeyImplEnum.ARRAY_INDEX_TYPE));
            return (elmtType.baseType() == Predefined_1.Predefined.charType) &&
                (indexType.baseType() == Predefined_1.Predefined.integerType);
        }
        else {
            return false;
        }
    };
    /**
     * @return the base type of this type.
     */
    TypeSpecImpl.prototype.baseType = function () {
        return this.form == TypeFormImpl_1.TypeFormImpl.get(TypeFormImpl_1.TypeFormImplEnum.SUBRANGE) ? this.getAttribute(TypeKeyImpl_1.TypeKeyImpl.get(TypeKeyImpl_1.TypeKeyImplEnum.SUBRANGE_BASE_TYPE))
            : this;
    };
    return TypeSpecImpl;
}(HashMap_1.HashMap));
exports.TypeSpecImpl = TypeSpecImpl;
