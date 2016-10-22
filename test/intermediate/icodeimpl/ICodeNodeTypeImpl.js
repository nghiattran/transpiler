// TODO : check this
"use strict";
(function (ICodeNodeTypeImpl) {
    // Program structure
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["PROGRAM"] = 0] = "PROGRAM";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["PROCEDURE"] = 1] = "PROCEDURE";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["FUNCTION"] = 2] = "FUNCTION";
    // Statements
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["COMPOUND"] = 3] = "COMPOUND";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["ASSIGN"] = 4] = "ASSIGN";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["LOOP"] = 5] = "LOOP";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["TEST"] = 6] = "TEST";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["CALL"] = 7] = "CALL";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["PARAMETERS"] = 8] = "PARAMETERS";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["IF"] = 9] = "IF";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["SELECT"] = 10] = "SELECT";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["SELECT_BRANCH"] = 11] = "SELECT_BRANCH";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["SELECT_CONSTANTS"] = 12] = "SELECT_CONSTANTS";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["NO_OP"] = 13] = "NO_OP";
    // Relational operators
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["EQ"] = 14] = "EQ";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["NE"] = 15] = "NE";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["LT"] = 16] = "LT";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["LE"] = 17] = "LE";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["GT"] = 18] = "GT";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["GE"] = 19] = "GE";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["NOT"] = 20] = "NOT";
    // Additive operators
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["ADD"] = 21] = "ADD";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["SUBTRACT"] = 22] = "SUBTRACT";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["OR"] = 23] = "OR";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["NEGATE"] = 24] = "NEGATE";
    // Multiplicative operators
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["MULTIPLY"] = 25] = "MULTIPLY";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["INTEGER_DIVIDE"] = 26] = "INTEGER_DIVIDE";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["FLOAT_DIVIDE"] = 27] = "FLOAT_DIVIDE";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["MOD"] = 28] = "MOD";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["AND"] = 29] = "AND";
    // Operands
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["VARIABLE"] = 30] = "VARIABLE";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["SUBSCRIPTS"] = 31] = "SUBSCRIPTS";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["FIELD"] = 32] = "FIELD";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["INTEGER_CONSTANT"] = 33] = "INTEGER_CONSTANT";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["REAL_CONSTANT"] = 34] = "REAL_CONSTANT";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["STRING_CONSTANT"] = 35] = "STRING_CONSTANT";
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["BOOLEAN_CONSTANT"] = 36] = "BOOLEAN_CONSTANT";
    // WRITE parameter
    ICodeNodeTypeImpl[ICodeNodeTypeImpl["WRITE_PARM"] = 37] = "WRITE_PARM";
})(exports.ICodeNodeTypeImpl || (exports.ICodeNodeTypeImpl = {}));
var ICodeNodeTypeImpl = exports.ICodeNodeTypeImpl;
