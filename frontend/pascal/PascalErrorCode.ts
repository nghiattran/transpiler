export class PascalErrorCode {
    static ALREADY_FORWARDED : PascalErrorCode = new PascalErrorCode('Already specified in FORWARD');
    static CASE_CONSTANT_REUSED : PascalErrorCode = new PascalErrorCode('CASE constant reused');
    static IDENTIFIER_REDEFINED : PascalErrorCode = new PascalErrorCode('Redefined identifier');
    static IDENTIFIER_UNDEFINED : PascalErrorCode = new PascalErrorCode('Undefined identifier');
    static INCOMPATIBLE_ASSIGNMENT : PascalErrorCode = new PascalErrorCode('Incompatible assignment');
    static INCOMPATIBLE_TYPES : PascalErrorCode = new PascalErrorCode('Incompatible types');
    static INVALID_ASSIGNMENT : PascalErrorCode = new PascalErrorCode('Invalid assignment statement');
    static INVALID_CHARACTER : PascalErrorCode = new PascalErrorCode('Invalid character');
    static INVALID_CONSTANT : PascalErrorCode = new PascalErrorCode('Invalid constant');
    static INVALID_EXPONENT : PascalErrorCode = new PascalErrorCode('Invalid exponent');
    static INVALID_EXPRESSION : PascalErrorCode = new PascalErrorCode('Invalid expression');
    static INVALID_FIELD : PascalErrorCode = new PascalErrorCode('Invalid field');
    static INVALID_FRACTION : PascalErrorCode = new PascalErrorCode('Invalid fraction');
    static INVALID_IDENTIFIER_USAGE : PascalErrorCode = new PascalErrorCode('Invalid identifier usage');
    static INVALID_INDEX_TYPE : PascalErrorCode = new PascalErrorCode('Invalid index type');
    static INVALID_NUMBER : PascalErrorCode = new PascalErrorCode('Invalid number');
    static INVALID_STATEMENT : PascalErrorCode = new PascalErrorCode('Invalid statement');
    static INVALID_SUBRANGE_TYPE : PascalErrorCode = new PascalErrorCode('Invalid subrange type');
    static INVALID_TARGET : PascalErrorCode = new PascalErrorCode('Invalid assignment target');
    static INVALID_TYPE : PascalErrorCode = new PascalErrorCode('Invalid type');
    static INVALID_VAR_PARM : PascalErrorCode = new PascalErrorCode('Invalid VAR parameter');
    static MIN_GT_MAX : PascalErrorCode = new PascalErrorCode('Min limit greater than max limit');
    static MISSING_BEGIN : PascalErrorCode = new PascalErrorCode('Missing BEGIN');
    static MISSING_COLON : PascalErrorCode = new PascalErrorCode('Missing :');
    static MISSING_COLON_EQUALS : PascalErrorCode = new PascalErrorCode('Missing :=');
    static MISSING_COMMA : PascalErrorCode = new PascalErrorCode('Missing ,');
    static MISSING_CONSTANT : PascalErrorCode = new PascalErrorCode('Missing constant');
    static MISSING_DO : PascalErrorCode = new PascalErrorCode('Missing DO');
    static MISSING_DOT_DOT : PascalErrorCode = new PascalErrorCode('Missing ..');
    static MISSING_END : PascalErrorCode = new PascalErrorCode('Missing END');
    static MISSING_EQUALS : PascalErrorCode = new PascalErrorCode('Missing =');
    static MISSING_FOR_CONTROL : PascalErrorCode = new PascalErrorCode('Invalid FOR control variable');
    static MISSING_IDENTIFIER : PascalErrorCode = new PascalErrorCode('Missing identifier');
    static MISSING_LEFT_BRACKET : PascalErrorCode = new PascalErrorCode('Missing [');
    static MISSING_OF : PascalErrorCode = new PascalErrorCode('Missing OF');
    static MISSING_PERIOD : PascalErrorCode = new PascalErrorCode('Missing .');
    static MISSING_PROGRAM : PascalErrorCode = new PascalErrorCode('Missing PROGRAM');
    static MISSING_RIGHT_BRACKET : PascalErrorCode = new PascalErrorCode('Missing ]');
    static MISSING_RIGHT_PAREN : PascalErrorCode = new PascalErrorCode('Missing )');
    static MISSING_SEMICOLON : PascalErrorCode = new PascalErrorCode('Missing ;');
    static MISSING_THEN : PascalErrorCode = new PascalErrorCode('Missing THEN');
    static MISSING_TO_DOWNTO : PascalErrorCode = new PascalErrorCode('Missing TO or DOWNTO');
    static MISSING_UNTIL : PascalErrorCode = new PascalErrorCode('Missing UNTIL');
    static MISSING_VARIABLE : PascalErrorCode = new PascalErrorCode('Missing variable');
    static NOT_CONSTANT_IDENTIFIER : PascalErrorCode = new PascalErrorCode('Not a constant identifier');
    static NOT_RECORD_VARIABLE : PascalErrorCode = new PascalErrorCode('Not a record variable');
    static NOT_TYPE_IDENTIFIER : PascalErrorCode = new PascalErrorCode('Not a type identifier');
    static RANGE_INTEGER : PascalErrorCode = new PascalErrorCode('Integer literal out of range');
    static RANGE_REAL : PascalErrorCode = new PascalErrorCode('Real literal out of range');
    static STACK_OVERFLOW : PascalErrorCode = new PascalErrorCode('Stack overflow');
    static TOO_MANY_LEVELS : PascalErrorCode = new PascalErrorCode('Nesting level too deep');
    static TOO_MANY_SUBSCRIPTS : PascalErrorCode = new PascalErrorCode('Too many subscripts');
    static UNEXPECTED_EOF : PascalErrorCode = new PascalErrorCode('Unexpected end of file');
    static UNEXPECTED_TOKEN : PascalErrorCode = new PascalErrorCode('Unexpected token');
    static UNIMPLEMENTED : PascalErrorCode = new PascalErrorCode('Unimplemented feature');
    static UNRECOGNIZABLE : PascalErrorCode = new PascalErrorCode('Unrecognizable input');
    static WRONG_NUMBER_OF_PARMS : PascalErrorCode = new PascalErrorCode('Wrong number of actual parameters');
    static IO_ERROR : PascalErrorCode = new PascalErrorCode('Object I/O error', -101);
    static TOO_MANY_ERRORS : PascalErrorCode = new PascalErrorCode('Too many syntax errors', -102);

    private message : string;
    private status : number;

    /**
     * Constructor.
     * @param status the exit status.
     * @param message the error message.
     */
    constructor(message : string, status: number = 0) {
        this.status = status;
        this.message = message;
    }

    /**
     * Getter.
     * @return the exit status.
     */
    public getStatus() : number {
        return this.status;
    }

    /**
     * @return the message.
     */
    public toString() : string {
        return this.message;
    }
}