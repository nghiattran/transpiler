"use strict";
var MessageType = (function () {
    function MessageType() {
    }
    MessageType.SOURCE_LINE = 1;
    MessageType.SYNTAX_ERROR = 2;
    MessageType.PARSER_SUMMARY = 3;
    MessageType.INTERPRETER_SUMMARY = 4;
    MessageType.COMPILER_SUMMARY = 5;
    MessageType.MISCELLANEOUS = 6;
    MessageType.TOKEN = 7;
    MessageType.ASSIGN = 8;
    MessageType.FETCH = 9;
    MessageType.BREAKPOINT = 10;
    MessageType.RUNTIME_ERROR = 11;
    MessageType.CALL = 12;
    MessageType.RETURN = 13;
    return MessageType;
}());
exports.MessageType = MessageType;
//# sourceMappingURL=MessageType.js.map