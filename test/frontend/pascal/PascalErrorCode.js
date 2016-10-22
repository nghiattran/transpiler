"use strict";
var PascalErrorCode = (function () {
    /**
     * Constructor.
     * @param status the exit status.
     * @param message the error message.
     */
    function PascalErrorCode(message, status) {
        if (status === void 0) { status = 0; }
        this.status = status;
        this.message = message;
    }
    /**
     * Getter.
     * @return the exit status.
     */
    PascalErrorCode.prototype.getStatus = function () {
        return this.status;
    };
    /**
     * @return the message.
     */
    PascalErrorCode.prototype.toString = function () {
        return this.message;
    };
    PascalErrorCode.ALREADY_FORWARDED = new PascalErrorCode('Already specified in FORWARD');
    PascalErrorCode.CASE_CONSTANT_REUSED = new PascalErrorCode('CASE constant reused');
    PascalErrorCode.IDENTIFIER_REDEFINED = new PascalErrorCode('Redefined identifier');
    PascalErrorCode.IDENTIFIER_UNDEFINED = new PascalErrorCode('Undefined identifier');
    PascalErrorCode.INCOMPATIBLE_ASSIGNMENT = new PascalErrorCode('Incompatible assignment');
    PascalErrorCode.INCOMPATIBLE_TYPES = new PascalErrorCode('Incompatible types');
    PascalErrorCode.INVALID_ASSIGNMENT = new PascalErrorCode('Invalid assignment statement');
    PascalErrorCode.INVALID_CHARACTER = new PascalErrorCode('Invalid character');
    PascalErrorCode.INVALID_CONSTANT = new PascalErrorCode('Invalid constant');
    PascalErrorCode.INVALID_EXPONENT = new PascalErrorCode('Invalid exponent');
    PascalErrorCode.INVALID_EXPRESSION = new PascalErrorCode('Invalid expression');
    PascalErrorCode.INVALID_FIELD = new PascalErrorCode('Invalid field');
    PascalErrorCode.INVALID_FRACTION = new PascalErrorCode('Invalid fraction');
    PascalErrorCode.INVALID_IDENTIFIER_USAGE = new PascalErrorCode('Invalid identifier usage');
    PascalErrorCode.INVALID_INDEX_TYPE = new PascalErrorCode('Invalid index type');
    PascalErrorCode.INVALID_NUMBER = new PascalErrorCode('Invalid number');
    PascalErrorCode.INVALID_STATEMENT = new PascalErrorCode('Invalid statement');
    PascalErrorCode.INVALID_SUBRANGE_TYPE = new PascalErrorCode('Invalid subrange type');
    PascalErrorCode.INVALID_TARGET = new PascalErrorCode('Invalid assignment target');
    PascalErrorCode.INVALID_TYPE = new PascalErrorCode('Invalid type');
    PascalErrorCode.INVALID_VAR_PARM = new PascalErrorCode('Invalid VAR parameter');
    PascalErrorCode.MIN_GT_MAX = new PascalErrorCode('Min limit greater than max limit');
    PascalErrorCode.MISSING_BEGIN = new PascalErrorCode('Missing BEGIN');
    PascalErrorCode.MISSING_COLON = new PascalErrorCode('Missing :');
    PascalErrorCode.MISSING_COLON_EQUALS = new PascalErrorCode('Missing :=');
    PascalErrorCode.MISSING_COMMA = new PascalErrorCode('Missing ,');
    PascalErrorCode.MISSING_CONSTANT = new PascalErrorCode('Missing constant');
    PascalErrorCode.MISSING_DO = new PascalErrorCode('Missing DO');
    PascalErrorCode.MISSING_DOT_DOT = new PascalErrorCode('Missing ..');
    PascalErrorCode.MISSING_END = new PascalErrorCode('Missing END');
    PascalErrorCode.MISSING_EQUALS = new PascalErrorCode('Missing =');
    PascalErrorCode.MISSING_FOR_CONTROL = new PascalErrorCode('Invalid FOR control variable');
    PascalErrorCode.MISSING_IDENTIFIER = new PascalErrorCode('Missing identifier');
    PascalErrorCode.MISSING_LEFT_BRACKET = new PascalErrorCode('Missing [');
    PascalErrorCode.MISSING_OF = new PascalErrorCode('Missing OF');
    PascalErrorCode.MISSING_PERIOD = new PascalErrorCode('Missing .');
    PascalErrorCode.MISSING_PROGRAM = new PascalErrorCode('Missing PROGRAM');
    PascalErrorCode.MISSING_RIGHT_BRACKET = new PascalErrorCode('Missing ]');
    PascalErrorCode.MISSING_RIGHT_PAREN = new PascalErrorCode('Missing )');
    PascalErrorCode.MISSING_SEMICOLON = new PascalErrorCode('Missing ;');
    PascalErrorCode.MISSING_THEN = new PascalErrorCode('Missing THEN');
    PascalErrorCode.MISSING_TO_DOWNTO = new PascalErrorCode('Missing TO or DOWNTO');
    PascalErrorCode.MISSING_UNTIL = new PascalErrorCode('Missing UNTIL');
    PascalErrorCode.MISSING_VARIABLE = new PascalErrorCode('Missing variable');
    PascalErrorCode.NOT_CONSTANT_IDENTIFIER = new PascalErrorCode('Not a constant identifier');
    PascalErrorCode.NOT_RECORD_VARIABLE = new PascalErrorCode('Not a record variable');
    PascalErrorCode.NOT_TYPE_IDENTIFIER = new PascalErrorCode('Not a type identifier');
    PascalErrorCode.RANGE_INTEGER = new PascalErrorCode('Integer literal out of range');
    PascalErrorCode.RANGE_REAL = new PascalErrorCode('Real literal out of range');
    PascalErrorCode.STACK_OVERFLOW = new PascalErrorCode('Stack overflow');
    PascalErrorCode.TOO_MANY_LEVELS = new PascalErrorCode('Nesting level too deep');
    PascalErrorCode.TOO_MANY_SUBSCRIPTS = new PascalErrorCode('Too many subscripts');
    PascalErrorCode.UNEXPECTED_EOF = new PascalErrorCode('Unexpected end of file');
    PascalErrorCode.UNEXPECTED_TOKEN = new PascalErrorCode('Unexpected token');
    PascalErrorCode.UNIMPLEMENTED = new PascalErrorCode('Unimplemented feature');
    PascalErrorCode.UNRECOGNIZABLE = new PascalErrorCode('Unrecognizable input');
    PascalErrorCode.WRONG_NUMBER_OF_PARMS = new PascalErrorCode('Wrong number of actual parameters');
    PascalErrorCode.IO_ERROR = new PascalErrorCode('Object I/O error', -101);
    PascalErrorCode.TOO_MANY_ERRORS = new PascalErrorCode('Too many syntax errors', -102);
    return PascalErrorCode;
}());
exports.PascalErrorCode = PascalErrorCode;
