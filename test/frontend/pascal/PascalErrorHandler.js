"use strict";
var PascalErrorCode_1 = require('./PascalErrorCode');
var MessageType_1 = require('../../message/MessageType');
var Message_1 = require('../../message/Message');
var PascalErrorHandler = (function () {
    function PascalErrorHandler() {
    }
    /**
     * Getter.
     * @return the syntax error count.
     */
    PascalErrorHandler.prototype.getErrorCount = function () {
        return PascalErrorHandler.errorCount;
    };
    /**
     * Flag an error in the source line.
     * @param token the bad token.
     * @param errorCode the error code.
     * @param parser the parser.
     * @return the flagger string.
     */
    PascalErrorHandler.prototype.flag = function (token, errorCode, parser) {
        // Notify the parser's listeners.
        parser.sendMessage(new Message_1.Message(MessageType_1.MessageType.SYNTAX_ERROR, [token.getLineNumber(),
            token.getPosition(),
            token.getText(),
            errorCode.toString()]));
        if (++PascalErrorHandler.errorCount > PascalErrorHandler.MAX_ERRORS) {
            this.abortTranslation(PascalErrorCode_1.PascalErrorCode.TOO_MANY_ERRORS, parser);
        }
    };
    /**
     * Abort the translation.
     * @param errorCode the error code.
     * @param parser the parser.
     */
    PascalErrorHandler.prototype.abortTranslation = function (errorCode, parser) {
        // Notify the parser's listeners and then abort.
        var fatalText = "FATAL ERROR: " + errorCode.toString();
        parser.sendMessage(new Message_1.Message(MessageType_1.MessageType.SYNTAX_ERROR, [0,
            0,
            "",
            fatalText]));
        // System.exit(errorCode.getStatus());
    };
    PascalErrorHandler.MAX_ERRORS = 25;
    PascalErrorHandler.errorCount = 0; // count of syntax errors
    return PascalErrorHandler;
}());
exports.PascalErrorHandler = PascalErrorHandler;
