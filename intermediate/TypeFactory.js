"use strict";
var TypeSpecImpl_1 = require('./TypeSpecImpl');
var TypeFactory = (function () {
    function TypeFactory() {
    }
    /**
     * Create a type specification of a given form.
     * @param form the form.
     * @return the type specification.
     */
    TypeFactory.createType = function (form) {
        return new TypeSpecImpl_1.TypeSpecImpl(form);
    };
    /**
     * Create a string type specification.
     * @param value the string value.
     * @return the type specification.
     */
    TypeFactory.createStringType = function (value) {
        return new TypeSpecImpl_1.TypeSpecImpl(value);
    };
    return TypeFactory;
}());
exports.TypeFactory = TypeFactory;
