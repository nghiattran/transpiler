"use strict";
(function (MessageType) {
    MessageType[MessageType["SOURCE_LINE"] = 0] = "SOURCE_LINE";
    MessageType[MessageType["SYNTAX_ERROR"] = 1] = "SYNTAX_ERROR";
    MessageType[MessageType["PARSER_SUMMARY"] = 2] = "PARSER_SUMMARY";
    MessageType[MessageType["INTERPRETER_SUMMARY"] = 3] = "INTERPRETER_SUMMARY";
    MessageType[MessageType["COMPILER_SUMMARY"] = 4] = "COMPILER_SUMMARY";
    MessageType[MessageType["MISCELLANEOUS"] = 5] = "MISCELLANEOUS";
    MessageType[MessageType["TOKEN"] = 6] = "TOKEN";
    MessageType[MessageType["ASSIGN"] = 7] = "ASSIGN";
    MessageType[MessageType["FETCH"] = 8] = "FETCH";
    MessageType[MessageType["BREAKPOINT"] = 9] = "BREAKPOINT";
    MessageType[MessageType["RUNTIME_ERROR"] = 10] = "RUNTIME_ERROR";
    MessageType[MessageType["CALL"] = 11] = "CALL";
    MessageType[MessageType["RETURN"] = 12] = "RETURN";
})(exports.MessageType || (exports.MessageType = {}));
var MessageType = exports.MessageType;
