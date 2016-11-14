"use strict";
var PascalErrorCode_1 = require('./PascalErrorCode');
var MessageType_1 = require('../../message/MessageType');
var Message_1 = require('../../message/Message');
var PascalErrorHandler = (function () {
    function PascalErrorHandler() {
    }
    PascalErrorHandler.prototype.getErrorCount = function () {
        return PascalErrorHandler.errorCount;
    };
    PascalErrorHandler.prototype.flag = function (token, errorCode, parser) {
        parser.sendMessage(new Message_1.Message(MessageType_1.MessageType.SYNTAX_ERROR, [token.getLineNumber(),
            token.getPosition(),
            token.getText(),
            errorCode.toString()]));
        if (++PascalErrorHandler.errorCount > PascalErrorHandler.MAX_ERRORS) {
            this.abortTranslation(PascalErrorCode_1.PascalErrorCode.TOO_MANY_ERRORS, parser);
        }
    };
    PascalErrorHandler.prototype.abortTranslation = function (errorCode, parser) {
        var fatalText = "FATAL ERROR: " + errorCode.toString();
        parser.sendMessage(new Message_1.Message(MessageType_1.MessageType.SYNTAX_ERROR, [0,
            0,
            "",
            fatalText]));
    };
    PascalErrorHandler.MAX_ERRORS = 25;
    PascalErrorHandler.errorCount = 0;
    return PascalErrorHandler;
}());
exports.PascalErrorHandler = PascalErrorHandler;
//# sourceMappingURL=PascalErrorHandler.js.map