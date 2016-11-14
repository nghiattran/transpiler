"use strict";
var Util = (function () {
    function Util() {
    }
    Util.isInteger = function (value) {
        return Util.isFloat(value) &&
            Math.floor(value) === value;
    };
    Util.isFloat = function (value) {
        return Util.isNumber(value) &&
            isFinite(value);
    };
    Util.isNumber = function (value) {
        return typeof value === 'number';
    };
    Util.isDigit = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n) && n.length === 1;
    };
    Util.isLetter = function (char) {
        return /^[a-zA-Z]/.test(char) && char.length === 1;
    };
    Util.isLetterOrDigit = function (char) {
        return Util.isDigit(char) || Util.isLetter(char);
    };
    Util.getNumericValue = function (aString) {
        return Number(aString);
    };
    return Util;
}());
exports.Util = Util;
//# sourceMappingURL=Util.js.map