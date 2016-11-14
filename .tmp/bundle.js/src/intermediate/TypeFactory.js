"use strict";
var TypeSpecImpl_1 = require('./typeimpl/TypeSpecImpl');
var TypeFactory = (function () {
    function TypeFactory() {
    }
    TypeFactory.createType = function (form) {
        return new TypeSpecImpl_1.TypeSpecImpl(form);
    };
    TypeFactory.createStringType = function (value) {
        return new TypeSpecImpl_1.TypeSpecImpl(value);
    };
    return TypeFactory;
}());
exports.TypeFactory = TypeFactory;
//# sourceMappingURL=TypeFactory.js.map