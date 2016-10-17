"use strict";
var RoutineCodeImpl = (function () {
    /**
     * Constructor.
     */
    function RoutineCodeImpl(text) {
        text = text || this.toString().toLowerCase();
    }
    /**
     * Getter.
     * @return the text of the definition code.
     */
    RoutineCodeImpl.prototype.getText = function () {
        return this.text;
    };
    RoutineCodeImpl.get = function (type) {
        return new RoutineCodeImpl(RoutineCodeImplEnum[type]);
    };
    return RoutineCodeImpl;
}());
exports.RoutineCodeImpl = RoutineCodeImpl;
(function (RoutineCodeImplEnum) {
    RoutineCodeImplEnum[RoutineCodeImplEnum["DECLARED"] = 0] = "DECLARED";
    RoutineCodeImplEnum[RoutineCodeImplEnum["FORWARD"] = 1] = "FORWARD";
    RoutineCodeImplEnum[RoutineCodeImplEnum["READ"] = 2] = "READ";
    RoutineCodeImplEnum[RoutineCodeImplEnum["READLN"] = 3] = "READLN";
    RoutineCodeImplEnum[RoutineCodeImplEnum["WRITE"] = 4] = "WRITE";
    RoutineCodeImplEnum[RoutineCodeImplEnum["WRITELN"] = 5] = "WRITELN";
    RoutineCodeImplEnum[RoutineCodeImplEnum["ABS"] = 6] = "ABS";
    RoutineCodeImplEnum[RoutineCodeImplEnum["ARCTAN"] = 7] = "ARCTAN";
    RoutineCodeImplEnum[RoutineCodeImplEnum["CHR"] = 8] = "CHR";
    RoutineCodeImplEnum[RoutineCodeImplEnum["COS"] = 9] = "COS";
    RoutineCodeImplEnum[RoutineCodeImplEnum["EOF"] = 10] = "EOF";
    RoutineCodeImplEnum[RoutineCodeImplEnum["EOLN"] = 11] = "EOLN";
    RoutineCodeImplEnum[RoutineCodeImplEnum["EXP"] = 12] = "EXP";
    RoutineCodeImplEnum[RoutineCodeImplEnum["LN"] = 13] = "LN";
    RoutineCodeImplEnum[RoutineCodeImplEnum["ODD"] = 14] = "ODD";
    RoutineCodeImplEnum[RoutineCodeImplEnum["ORD"] = 15] = "ORD";
    RoutineCodeImplEnum[RoutineCodeImplEnum["PRED"] = 16] = "PRED";
    RoutineCodeImplEnum[RoutineCodeImplEnum["ROUND"] = 17] = "ROUND";
    RoutineCodeImplEnum[RoutineCodeImplEnum["SIN"] = 18] = "SIN";
    RoutineCodeImplEnum[RoutineCodeImplEnum["SQR"] = 19] = "SQR";
    RoutineCodeImplEnum[RoutineCodeImplEnum["SQRT"] = 20] = "SQRT";
    RoutineCodeImplEnum[RoutineCodeImplEnum["SUCC"] = 21] = "SUCC";
    RoutineCodeImplEnum[RoutineCodeImplEnum["TRUNC"] = 22] = "TRUNC";
})(exports.RoutineCodeImplEnum || (exports.RoutineCodeImplEnum = {}));
var RoutineCodeImplEnum = exports.RoutineCodeImplEnum;
