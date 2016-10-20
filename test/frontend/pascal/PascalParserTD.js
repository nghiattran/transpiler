"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
    function PascalParserTD(scanner) {
        _super.call(this, scanner);
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
    return PascalParserTD;
}(Parser_1.Parser));
exports.PascalParserTD = PascalParserTD;
