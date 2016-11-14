"use strict";
var TypeFormImpl_1 = require('./TypeFormImpl');
var Predefined_1 = require('../symtabimpl/Predefined');
var TypeChecker = (function () {
    function TypeChecker() {
    }
    TypeChecker.isInteger = function (type) {
        return (type !== undefined) && (type.baseType() === Predefined_1.Predefined.integerType);
    };
    TypeChecker.areBothInteger = function (type1, type2) {
        return this.isInteger(type1) && this.isInteger(type2);
    };
    TypeChecker.isReal = function (type) {
        return (type !== undefined) && (type.baseType() === Predefined_1.Predefined.realType);
    };
    TypeChecker.isIntegerOrReal = function (type) {
        return this.isInteger(type) || this.isReal(type);
    };
    TypeChecker.isAtLeastOneReal = function (type1, type2) {
        return (this.isReal(type1) && this.isReal(type2)) ||
            (this.isReal(type1) && this.isInteger(type2)) ||
            (this.isInteger(type1) && this.isReal(type2));
    };
    TypeChecker.isBoolean = function (type) {
        return (type !== undefined) && (type.baseType() === Predefined_1.Predefined.booleanType);
    };
    TypeChecker.areBothBoolean = function (type1, type2) {
        return this.isBoolean(type1) && this.isBoolean(type2);
    };
    TypeChecker.isChar = function (type) {
        return (type !== undefined) && (type.baseType() === Predefined_1.Predefined.charType);
    };
    TypeChecker.areAssignmentCompatible = function (targetType, valueType) {
        if ((targetType === undefined) || (valueType === undefined)) {
            return false;
        }
        targetType = targetType.baseType();
        valueType = valueType.baseType();
        var compatible = false;
        if (targetType === valueType) {
            compatible = true;
        }
        else if (this.isReal(targetType) && this.isInteger(valueType)) {
            compatible = true;
        }
        else {
            compatible =
                targetType.isPascalString() && valueType.isPascalString();
        }
        return compatible;
    };
    TypeChecker.areComparisonCompatible = function (type1, type2) {
        if ((type1 === undefined) || (type2 === undefined)) {
            return false;
        }
        type1 = type1.baseType();
        type2 = type2.baseType();
        var form = type1.getForm();
        var compatible = false;
        if ((type1 === type2) && ((form === TypeFormImpl_1.TypeFormImpl.SCALAR) || (form === TypeFormImpl_1.TypeFormImpl.ENUMERATION))) {
            compatible = true;
        }
        else if (this.isAtLeastOneReal(type1, type2)) {
            compatible = true;
        }
        else {
            compatible = type1.isPascalString() && type2.isPascalString();
        }
        return compatible;
    };
    return TypeChecker;
}());
exports.TypeChecker = TypeChecker;
//# sourceMappingURL=TypeChecker.js.map