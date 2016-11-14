"use strict";
var RoutineCodeImpl = (function () {
    function RoutineCodeImpl(text) {
        text = text || this.toString().toLowerCase();
    }
    RoutineCodeImpl.prototype.getText = function () {
        return this.text;
    };
    RoutineCodeImpl.DECLARED = new RoutineCodeImpl('DECLARED');
    RoutineCodeImpl.FORWARD = new RoutineCodeImpl('FORWARD');
    RoutineCodeImpl.READ = new RoutineCodeImpl('READ');
    RoutineCodeImpl.READLN = new RoutineCodeImpl('READLN');
    RoutineCodeImpl.WRITE = new RoutineCodeImpl('WRITE');
    RoutineCodeImpl.WRITELN = new RoutineCodeImpl('WRITELN');
    RoutineCodeImpl.ABS = new RoutineCodeImpl('ABS');
    RoutineCodeImpl.ARCTAN = new RoutineCodeImpl('ARCTAN');
    RoutineCodeImpl.CHR = new RoutineCodeImpl('CHR');
    RoutineCodeImpl.COS = new RoutineCodeImpl('COS');
    RoutineCodeImpl.EOF = new RoutineCodeImpl('EOF');
    RoutineCodeImpl.EOLN = new RoutineCodeImpl('EOLN');
    RoutineCodeImpl.EXP = new RoutineCodeImpl('EXP');
    RoutineCodeImpl.LN = new RoutineCodeImpl('LN');
    RoutineCodeImpl.ODD = new RoutineCodeImpl('ODD');
    RoutineCodeImpl.ORD = new RoutineCodeImpl('ORD');
    RoutineCodeImpl.PRED = new RoutineCodeImpl('PRED');
    RoutineCodeImpl.ROUND = new RoutineCodeImpl('ROUND');
    RoutineCodeImpl.SIN = new RoutineCodeImpl('SIN');
    RoutineCodeImpl.SQR = new RoutineCodeImpl('SQR');
    RoutineCodeImpl.SQRT = new RoutineCodeImpl('SQRT');
    RoutineCodeImpl.SUCC = new RoutineCodeImpl('SUCC');
    RoutineCodeImpl.TRUNC = new RoutineCodeImpl('TRUNC');
    return RoutineCodeImpl;
}());
exports.RoutineCodeImpl = RoutineCodeImpl;
//# sourceMappingURL=RoutineCodeImpl.js.map