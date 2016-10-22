"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PascalErrorHandler_1 = require('./PascalErrorHandler');
var PascalErrorCode_1 = require('./PascalErrorCode');
var Parser_1 = require('../Parser');
var EofToken_1 = require('../EofToken');
var MessageType_1 = require('../../message/MessageType');
var Message_1 = require('../../message/Message');
var PascalParserTD = (function (_super) {
    __extends(PascalParserTD, _super);
    /**
     * Constructor.
     * @param scanner the scanner to be used with this parser.
     */
    function PascalParserTD(param) {
        if (param instanceof PascalParserTD) {
            _super.call(this, param.getScanner());
        }
        else {
            _super.call(this, param);
        }
    }
    /**
     * Parse a Pascal source program and generate the symbol table
     * and the intermediate code.
     */
    PascalParserTD.prototype.parse = function () {
        var token;
        // let startTime : number = performance.now();
        while (!((token = this.nextToken()) instanceof EofToken_1.EofToken)) { }
        // Send the parser summary message.
        // let elapsedTime : number = performance.now() - startTime;
        var elapsedTime = 0;
        this.sendMessage(new Message_1.Message(MessageType_1.MessageType.PARSER_SUMMARY, [token.getLineNumber(),
            this.getErrorCount(),
            elapsedTime]));
    };
    /**
     * Return the number of syntax errors found by the parser.
     * @return the error count.
     */
    PascalParserTD.prototype.getErrorCount = function () {
        return 0;
    };
    /**
     * Synchronize the parser.
     * @param syncSet the set of token types for synchronizing the parser.
     * @return the token where the parser has synchronized.
     * @throws Exception if an error occurred.
     */
    PascalParserTD.prototype.synchronize = function (syncSet) {
        var token = this.currentToken();
        // If the current token is not in the synchronization set,
        // then it is unexpected and the parser must recover.
        if (!syncSet.contains(token.getType())) {
            // Flag the unexpected token.
            PascalParserTD.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.UNEXPECTED_TOKEN, this);
            // Recover by skipping tokens that are not
            // in the synchronization set.
            do {
                token = this.nextToken();
            } while (!(token instanceof EofToken_1.EofToken) &&
                !syncSet.contains(token.getType()));
        }
        return token;
    };
    PascalParserTD.errorHandler = new PascalErrorHandler_1.PascalErrorHandler();
    return PascalParserTD;
}(Parser_1.Parser));
exports.PascalParserTD = PascalParserTD;
