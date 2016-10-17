"use strict";
var TypeFormImpl = (function () {
    /**
     * Constructor.
     */
    function TypeFormImpl(text) {
        text = text || this.toString().toLowerCase();
    }
    /**
     * Getter.
     * @return the text of the definition code.
     */
    TypeFormImpl.prototype.getText = function () {
        return this.text;
    };
    TypeFormImpl.get = function (type) {
        return new TypeFormImpl(TypeFormImplEnum[type]);
    };
    TypeFormImpl.prototype.toString = function () {
        return this.toString().toLowerCase();
    };
    return TypeFormImpl;
}());
exports.TypeFormImpl = TypeFormImpl;
(function (TypeFormImplEnum) {
    TypeFormImplEnum[TypeFormImplEnum["SCALAR"] = 0] = "SCALAR";
    TypeFormImplEnum[TypeFormImplEnum["ENUMERATION"] = 1] = "ENUMERATION";
    TypeFormImplEnum[TypeFormImplEnum["SUBRANGE"] = 2] = "SUBRANGE";
    TypeFormImplEnum[TypeFormImplEnum["ARRAY"] = 3] = "ARRAY";
    TypeFormImplEnum[TypeFormImplEnum["RECORD"] = 4] = "RECORD";
})(exports.TypeFormImplEnum || (exports.TypeFormImplEnum = {}));
var TypeFormImplEnum = exports.TypeFormImplEnum;
