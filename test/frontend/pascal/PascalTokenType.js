"use strict";
var List_1 = require('../../util/List');
var HashMap_1 = require('../../util/HashMap');
(function (PascalTokenTypeEnum) {
    // Reserved words.
    PascalTokenTypeEnum[PascalTokenTypeEnum["AND"] = 0] = "AND";
    PascalTokenTypeEnum[PascalTokenTypeEnum["ARRAY"] = 1] = "ARRAY";
    PascalTokenTypeEnum[PascalTokenTypeEnum["BEGIN"] = 2] = "BEGIN";
    PascalTokenTypeEnum[PascalTokenTypeEnum["CASE"] = 3] = "CASE";
    PascalTokenTypeEnum[PascalTokenTypeEnum["CONST"] = 4] = "CONST";
    PascalTokenTypeEnum[PascalTokenTypeEnum["DIV"] = 5] = "DIV";
    PascalTokenTypeEnum[PascalTokenTypeEnum["DO"] = 6] = "DO";
    PascalTokenTypeEnum[PascalTokenTypeEnum["DOWNTO"] = 7] = "DOWNTO";
    PascalTokenTypeEnum[PascalTokenTypeEnum["ELSE"] = 8] = "ELSE";
    PascalTokenTypeEnum[PascalTokenTypeEnum["END"] = 9] = "END";
    PascalTokenTypeEnum[PascalTokenTypeEnum["FILE"] = 10] = "FILE";
    PascalTokenTypeEnum[PascalTokenTypeEnum["FOR"] = 11] = "FOR";
    PascalTokenTypeEnum[PascalTokenTypeEnum["FUNCTION"] = 12] = "FUNCTION";
    PascalTokenTypeEnum[PascalTokenTypeEnum["GOTO"] = 13] = "GOTO";
    PascalTokenTypeEnum[PascalTokenTypeEnum["IF"] = 14] = "IF";
    PascalTokenTypeEnum[PascalTokenTypeEnum["IN"] = 15] = "IN";
    PascalTokenTypeEnum[PascalTokenTypeEnum["LABEL"] = 16] = "LABEL";
    PascalTokenTypeEnum[PascalTokenTypeEnum["MOD"] = 17] = "MOD";
    PascalTokenTypeEnum[PascalTokenTypeEnum["NIL"] = 18] = "NIL";
    PascalTokenTypeEnum[PascalTokenTypeEnum["NOT"] = 19] = "NOT";
    PascalTokenTypeEnum[PascalTokenTypeEnum["OF"] = 20] = "OF";
    PascalTokenTypeEnum[PascalTokenTypeEnum["OR"] = 21] = "OR";
    PascalTokenTypeEnum[PascalTokenTypeEnum["PACKED"] = 22] = "PACKED";
    PascalTokenTypeEnum[PascalTokenTypeEnum["PROCEDURE"] = 23] = "PROCEDURE";
    PascalTokenTypeEnum[PascalTokenTypeEnum["PROGRAM"] = 24] = "PROGRAM";
    PascalTokenTypeEnum[PascalTokenTypeEnum["RECORD"] = 25] = "RECORD";
    PascalTokenTypeEnum[PascalTokenTypeEnum["REPEAT"] = 26] = "REPEAT";
    PascalTokenTypeEnum[PascalTokenTypeEnum["SET"] = 27] = "SET";
    PascalTokenTypeEnum[PascalTokenTypeEnum["THEN"] = 28] = "THEN";
    PascalTokenTypeEnum[PascalTokenTypeEnum["TO"] = 29] = "TO";
    PascalTokenTypeEnum[PascalTokenTypeEnum["TYPE"] = 30] = "TYPE";
    PascalTokenTypeEnum[PascalTokenTypeEnum["UNTIL"] = 31] = "UNTIL";
    PascalTokenTypeEnum[PascalTokenTypeEnum["VAR"] = 32] = "VAR";
    PascalTokenTypeEnum[PascalTokenTypeEnum["WHILE"] = 33] = "WHILE";
    PascalTokenTypeEnum[PascalTokenTypeEnum["WITH"] = 34] = "WITH";
    // Special symbols.
    PascalTokenTypeEnum[PascalTokenTypeEnum["PLUS"] = 35] = "PLUS"; //("+")
    PascalTokenTypeEnum[PascalTokenTypeEnum["MINUS"] = 36] = "MINUS"; //("-")
    PascalTokenTypeEnum[PascalTokenTypeEnum["STAR"] = 37] = "STAR"; //("*")
    PascalTokenTypeEnum[PascalTokenTypeEnum["SLASH"] = 38] = "SLASH"; //("/")
    PascalTokenTypeEnum[PascalTokenTypeEnum["COLON_EQUALS"] = 39] = "COLON_EQUALS"; //(":=")
    PascalTokenTypeEnum[PascalTokenTypeEnum["DOT"] = 40] = "DOT"; //(".")
    PascalTokenTypeEnum[PascalTokenTypeEnum["COMMA"] = 41] = "COMMA"; //(",")
    PascalTokenTypeEnum[PascalTokenTypeEnum["SEMICOLON"] = 42] = "SEMICOLON"; //(";")
    PascalTokenTypeEnum[PascalTokenTypeEnum["COLON"] = 43] = "COLON"; //(":")
    PascalTokenTypeEnum[PascalTokenTypeEnum["QUOTE"] = 44] = "QUOTE"; //("'")
    PascalTokenTypeEnum[PascalTokenTypeEnum["EQUALS"] = 45] = "EQUALS"; //("=")
    PascalTokenTypeEnum[PascalTokenTypeEnum["NOT_EQUALS"] = 46] = "NOT_EQUALS"; //("<>")
    PascalTokenTypeEnum[PascalTokenTypeEnum["LESS_THAN"] = 47] = "LESS_THAN"; //("<")
    PascalTokenTypeEnum[PascalTokenTypeEnum["LESS_EQUALS"] = 48] = "LESS_EQUALS"; //("<=")
    PascalTokenTypeEnum[PascalTokenTypeEnum["GREATER_EQUALS"] = 49] = "GREATER_EQUALS"; //(">=")
    PascalTokenTypeEnum[PascalTokenTypeEnum["GREATER_THAN"] = 50] = "GREATER_THAN"; //(">")
    PascalTokenTypeEnum[PascalTokenTypeEnum["LEFT_PAREN"] = 51] = "LEFT_PAREN"; //("(")
    PascalTokenTypeEnum[PascalTokenTypeEnum["RIGHT_PAREN"] = 52] = "RIGHT_PAREN"; //(")")
    PascalTokenTypeEnum[PascalTokenTypeEnum["LEFT_BRACKET"] = 53] = "LEFT_BRACKET"; //("[")
    PascalTokenTypeEnum[PascalTokenTypeEnum["RIGHT_BRACKET"] = 54] = "RIGHT_BRACKET"; //("]")
    PascalTokenTypeEnum[PascalTokenTypeEnum["LEFT_BRACE"] = 55] = "LEFT_BRACE"; //("{")
    PascalTokenTypeEnum[PascalTokenTypeEnum["RIGHT_BRACE"] = 56] = "RIGHT_BRACE"; //("}")
    PascalTokenTypeEnum[PascalTokenTypeEnum["UP_ARROW"] = 57] = "UP_ARROW"; // ("^")
    PascalTokenTypeEnum[PascalTokenTypeEnum["DOT_DOT"] = 58] = "DOT_DOT"; // ("..")
    PascalTokenTypeEnum[PascalTokenTypeEnum["IDENTIFIER"] = 59] = "IDENTIFIER";
    PascalTokenTypeEnum[PascalTokenTypeEnum["INTEGER"] = 60] = "INTEGER";
    PascalTokenTypeEnum[PascalTokenTypeEnum["REAL"] = 61] = "REAL";
    PascalTokenTypeEnum[PascalTokenTypeEnum["STRING"] = 62] = "STRING";
    PascalTokenTypeEnum[PascalTokenTypeEnum["ERROR"] = 63] = "ERROR";
    PascalTokenTypeEnum[PascalTokenTypeEnum["END_OF_FILE"] = 64] = "END_OF_FILE";
})(exports.PascalTokenTypeEnum || (exports.PascalTokenTypeEnum = {}));
var PascalTokenTypeEnum = exports.PascalTokenTypeEnum;
var PascalTokenTypeEnum;
(function (PascalTokenTypeEnum) {
    function isIndex(key) {
        var n = ~~Number(key);
        return String(n) === key && n >= 0;
    }
    var _names = Object
        .keys(PascalTokenTypeEnum)
        .filter(function (key) { return !isIndex(key); });
    var _indices = Object
        .keys(PascalTokenTypeEnum)
        .filter(function (key) { return isIndex(key); })
        .map(function (index) { return Number(index); });
    function names() {
        return _names;
    }
    PascalTokenTypeEnum.names = names;
    function indices() {
        return _indices;
    }
    PascalTokenTypeEnum.indices = indices;
})(PascalTokenTypeEnum = exports.PascalTokenTypeEnum || (exports.PascalTokenTypeEnum = {}));
var PascalTokenType = (function () {
    /**
     * Constructor.
     * @param text the token text.
     */
    function PascalTokenType(text) {
        text = text || this.toString().toLowerCase();
        this.text = text;
    }
    PascalTokenType.initialize = function () {
        var values = PascalTokenTypeEnum.names();
        for (var i = PascalTokenType.FIRST_RESERVED_INDEX; i < PascalTokenType.LAST_RESERVED_INDEX; ++i) {
            PascalTokenType.RESERVED_WORDS.add(PascalTokenType[values[i]]);
        }
        var specialValues = PascalTokenTypeEnum.names();
        for (var i = PascalTokenType.FIRST_SPECIAL_INDEX; i < PascalTokenType.LAST_SPECIAL_INDEX; ++i) {
            PascalTokenType.SPECIAL_SYMBOLS.put(PascalTokenType[values[i]].getText(), PascalTokenType[values[i]]);
        }
    };
    /**
     * Getter.
     * @return the token text.
     */
    PascalTokenType.prototype.getText = function () {
        return this.text;
    };
    PascalTokenType.AND = new PascalTokenType('AND');
    PascalTokenType.ARRAY = new PascalTokenType('ARRAY');
    PascalTokenType.BEGIN = new PascalTokenType('BEGIN');
    PascalTokenType.CASE = new PascalTokenType('CASE');
    PascalTokenType.CONST = new PascalTokenType('CONST');
    PascalTokenType.DIV = new PascalTokenType('DIV');
    PascalTokenType.DO = new PascalTokenType('DO');
    PascalTokenType.DOWNTO = new PascalTokenType('DOWNTO');
    PascalTokenType.ELSE = new PascalTokenType('ELSE');
    PascalTokenType.END = new PascalTokenType('END');
    PascalTokenType.FILE = new PascalTokenType('FILE');
    PascalTokenType.FOR = new PascalTokenType('FOR');
    PascalTokenType.FUNCTION = new PascalTokenType('FUNCTION');
    PascalTokenType.GOTO = new PascalTokenType('GOTO');
    PascalTokenType.IF = new PascalTokenType('IF');
    PascalTokenType.IN = new PascalTokenType('IN');
    PascalTokenType.LABEL = new PascalTokenType('LABEL');
    PascalTokenType.MOD = new PascalTokenType('MOD');
    PascalTokenType.NIL = new PascalTokenType('NIL');
    PascalTokenType.NOT = new PascalTokenType('NOT');
    PascalTokenType.OF = new PascalTokenType('OF');
    PascalTokenType.OR = new PascalTokenType('OR');
    PascalTokenType.PACKED = new PascalTokenType('PACKED');
    PascalTokenType.PROCEDURE = new PascalTokenType('PROCEDURE');
    PascalTokenType.PROGRAM = new PascalTokenType('PROGRAM');
    PascalTokenType.RECORD = new PascalTokenType('RECORD');
    PascalTokenType.REPEAT = new PascalTokenType('REPEAT');
    PascalTokenType.SET = new PascalTokenType('SET');
    PascalTokenType.THEN = new PascalTokenType('THEN');
    PascalTokenType.TO = new PascalTokenType('TO');
    PascalTokenType.TYPE = new PascalTokenType('TYPE');
    PascalTokenType.UNTIL = new PascalTokenType('UNTIL');
    PascalTokenType.VAR = new PascalTokenType('VAR');
    PascalTokenType.WHILE = new PascalTokenType('WHILE');
    PascalTokenType.WITH = new PascalTokenType('WITH');
    PascalTokenType.PLUS = new PascalTokenType('+');
    PascalTokenType.MINUS = new PascalTokenType('-');
    PascalTokenType.STAR = new PascalTokenType('*');
    PascalTokenType.SLASH = new PascalTokenType('/');
    PascalTokenType.COLON_EQUALS = new PascalTokenType(':=');
    PascalTokenType.DOT = new PascalTokenType('/');
    PascalTokenType.COMMA = new PascalTokenType(',');
    PascalTokenType.SEMICOLON = new PascalTokenType(';');
    PascalTokenType.COLON = new PascalTokenType(':');
    PascalTokenType.QUOTE = new PascalTokenType('"');
    PascalTokenType.EQUALS = new PascalTokenType('=');
    PascalTokenType.NOT_EQUALS = new PascalTokenType('<>');
    PascalTokenType.LESS_THAN = new PascalTokenType('<');
    PascalTokenType.LESS_EQUALS = new PascalTokenType('<=');
    PascalTokenType.GREATER_EQUALS = new PascalTokenType('>=');
    PascalTokenType.GREATER_THAN = new PascalTokenType('>');
    PascalTokenType.LEFT_PAREN = new PascalTokenType('(');
    PascalTokenType.RIGHT_PAREN = new PascalTokenType(')');
    PascalTokenType.LEFT_BRACKET = new PascalTokenType('[');
    PascalTokenType.RIGHT_BRACKET = new PascalTokenType(']');
    PascalTokenType.LEFT_BRACE = new PascalTokenType('{');
    PascalTokenType.RIGHT_BRACE = new PascalTokenType('}');
    PascalTokenType.UP_ARROW = new PascalTokenType('^');
    PascalTokenType.DOT_DOT = new PascalTokenType('..');
    PascalTokenType.IDENTIFIER = new PascalTokenType('IDENTIFIER');
    PascalTokenType.INTEGER = new PascalTokenType('INTEGER');
    PascalTokenType.REAL = new PascalTokenType('REAL');
    PascalTokenType.STRING = new PascalTokenType('STRING');
    PascalTokenType.ERROR = new PascalTokenType('ERROR');
    PascalTokenType.END_OF_FILE = new PascalTokenType('END_OF_FILE');
    PascalTokenType.FIRST_RESERVED_INDEX = PascalTokenTypeEnum.AND;
    PascalTokenType.LAST_RESERVED_INDEX = PascalTokenTypeEnum.WITH;
    PascalTokenType.FIRST_SPECIAL_INDEX = PascalTokenTypeEnum.PLUS;
    PascalTokenType.LAST_SPECIAL_INDEX = PascalTokenTypeEnum.DOT_DOT;
    // Set of lower-cased Pascal reserved word text strings.
    PascalTokenType.RESERVED_WORDS = new List_1.List();
    // Hash table of Pascal special symbols.  Each special symbol's text
    // is the key to its Pascal token type.
    PascalTokenType.SPECIAL_SYMBOLS = new HashMap_1.HashMap();
    return PascalTokenType;
}());
exports.PascalTokenType = PascalTokenType;
var PascalTokenType;
(function (PascalTokenType) {
    PascalTokenType.initialize();
})(PascalTokenType = exports.PascalTokenType || (exports.PascalTokenType = {}));
