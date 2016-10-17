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
    TypeFormImpl.prototype.toString = function () {
        return this.toString().toLowerCase();
    };
    TypeFormImpl.SCALAR = new TypeFormImpl('SCALAR');
    TypeFormImpl.ENUMERATION = new TypeFormImpl('ENUMERATION');
    TypeFormImpl.SUBRANGE = new TypeFormImpl('SUBRANGE');
    TypeFormImpl.ARRAY = new TypeFormImpl('ARRAY');
    TypeFormImpl.RECORD = new TypeFormImpl('RECORD');
    return TypeFormImpl;
}());
exports.TypeFormImpl = TypeFormImpl;
