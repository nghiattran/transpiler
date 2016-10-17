"use strict";
var DefinitionImpl = (function () {
    /**
     * Constructor.
     */
    function DefinitionImpl(text) {
        text = text || this.toString().toLowerCase();
    }
    /**
     * Getter.
     * @return the text of the definition code.
     */
    DefinitionImpl.prototype.getText = function () {
        return this.text;
    };
    DefinitionImpl.get = function (type) {
        return new DefinitionImpl(DefinitionImplEnum[type]);
    };
    return DefinitionImpl;
}());
exports.DefinitionImpl = DefinitionImpl;
(function (DefinitionImplEnum) {
    DefinitionImplEnum[DefinitionImplEnum["CONSTANT"] = 0] = "CONSTANT";
    DefinitionImplEnum[DefinitionImplEnum["ENUMERATION_CONSTANT"] = 1] = "ENUMERATION_CONSTANT";
    DefinitionImplEnum[DefinitionImplEnum["TYPE"] = 2] = "TYPE";
    DefinitionImplEnum[DefinitionImplEnum["VARIABLE"] = 3] = "VARIABLE";
    DefinitionImplEnum[DefinitionImplEnum["FIELD"] = 4] = "FIELD";
    DefinitionImplEnum[DefinitionImplEnum["VALUE_PARM"] = 5] = "VALUE_PARM";
    DefinitionImplEnum[DefinitionImplEnum["VAR_PARM"] = 6] = "VAR_PARM";
    DefinitionImplEnum[DefinitionImplEnum["PROGRAM_PARM"] = 7] = "PROGRAM_PARM";
    DefinitionImplEnum[DefinitionImplEnum["PROGRAM"] = 8] = "PROGRAM";
    DefinitionImplEnum[DefinitionImplEnum["PROCEDURE"] = 9] = "PROCEDURE";
    DefinitionImplEnum[DefinitionImplEnum["FUNCTION"] = 10] = "FUNCTION";
    DefinitionImplEnum[DefinitionImplEnum["UNDEFINED"] = 11] = "UNDEFINED";
})(exports.DefinitionImplEnum || (exports.DefinitionImplEnum = {}));
var DefinitionImplEnum = exports.DefinitionImplEnum;
