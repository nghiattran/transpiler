"use strict";
var ICodeNodeTypeImpl = (function () {
    function ICodeNodeTypeImpl(text) {
        this.text = text;
    }
    ICodeNodeTypeImpl.prototype.toString = function () {
        return this.text;
    };
    ICodeNodeTypeImpl.PROGRAM = new ICodeNodeTypeImpl('PROGRAM');
    ICodeNodeTypeImpl.PROCEDURE = new ICodeNodeTypeImpl('PROCEDURE');
    ICodeNodeTypeImpl.FUNCTION = new ICodeNodeTypeImpl('FUNCTION');
    ICodeNodeTypeImpl.COMPOUND = new ICodeNodeTypeImpl('COMPOUND');
    ICodeNodeTypeImpl.ASSIGN = new ICodeNodeTypeImpl('ASSIGN');
    ICodeNodeTypeImpl.LOOP = new ICodeNodeTypeImpl('LOOP');
    ICodeNodeTypeImpl.TEST = new ICodeNodeTypeImpl('TEST');
    ICodeNodeTypeImpl.CALL = new ICodeNodeTypeImpl('CALL');
    ICodeNodeTypeImpl.PARAMETERS = new ICodeNodeTypeImpl('PARAMETERS');
    ICodeNodeTypeImpl.IF = new ICodeNodeTypeImpl('IF');
    ICodeNodeTypeImpl.SELECT = new ICodeNodeTypeImpl('SELECT');
    ICodeNodeTypeImpl.SELECT_BRANCH = new ICodeNodeTypeImpl('SELECT_BRANCH');
    ICodeNodeTypeImpl.SELECT_CONSTANTS = new ICodeNodeTypeImpl('SELECT_CONSTANTS');
    ICodeNodeTypeImpl.NO_OP = new ICodeNodeTypeImpl('NO_OP');
    ICodeNodeTypeImpl.EQ = new ICodeNodeTypeImpl('EQ');
    ICodeNodeTypeImpl.NE = new ICodeNodeTypeImpl('NE');
    ICodeNodeTypeImpl.LT = new ICodeNodeTypeImpl('LT');
    ICodeNodeTypeImpl.LE = new ICodeNodeTypeImpl('LE');
    ICodeNodeTypeImpl.GT = new ICodeNodeTypeImpl('GT');
    ICodeNodeTypeImpl.GE = new ICodeNodeTypeImpl('GE');
    ICodeNodeTypeImpl.NOT = new ICodeNodeTypeImpl('NOT');
    ICodeNodeTypeImpl.ADD = new ICodeNodeTypeImpl('ADD');
    ICodeNodeTypeImpl.SUBTRACT = new ICodeNodeTypeImpl('SUBTRACT');
    ICodeNodeTypeImpl.OR = new ICodeNodeTypeImpl('OR');
    ICodeNodeTypeImpl.NEGATE = new ICodeNodeTypeImpl('NEGATE');
    ICodeNodeTypeImpl.MULTIPLY = new ICodeNodeTypeImpl('MULTIPLY');
    ICodeNodeTypeImpl.INTEGER_DIVIDE = new ICodeNodeTypeImpl('INTEGER_DIVIDE');
    ICodeNodeTypeImpl.FLOAT_DIVIDE = new ICodeNodeTypeImpl('FLOAT_DIVIDE');
    ICodeNodeTypeImpl.MOD = new ICodeNodeTypeImpl('MOD');
    ICodeNodeTypeImpl.AND = new ICodeNodeTypeImpl('AND');
    ICodeNodeTypeImpl.VARIABLE = new ICodeNodeTypeImpl('VARIABLE');
    ICodeNodeTypeImpl.SUBSCRIPTS = new ICodeNodeTypeImpl('SUBSCRIPTS');
    ICodeNodeTypeImpl.FIELD = new ICodeNodeTypeImpl('FIELD');
    ICodeNodeTypeImpl.INTEGER_CONSTANT = new ICodeNodeTypeImpl('INTEGER_CONSTANT');
    ICodeNodeTypeImpl.REAL_CONSTANT = new ICodeNodeTypeImpl('REAL_CONSTANT');
    ICodeNodeTypeImpl.STRING_CONSTANT = new ICodeNodeTypeImpl('STRING_CONSTANT');
    ICodeNodeTypeImpl.BOOLEAN_CONSTANT = new ICodeNodeTypeImpl('BOOLEAN_CONSTANT');
    ICodeNodeTypeImpl.WRITE_PARM = new ICodeNodeTypeImpl('WRITE_PARM');
    return ICodeNodeTypeImpl;
}());
exports.ICodeNodeTypeImpl = ICodeNodeTypeImpl;
//# sourceMappingURL=ICodeNodeTypeImpl.js.map