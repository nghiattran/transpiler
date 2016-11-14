"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PascalErrorCode_1 = require('./PascalErrorCode');
var PascalParser_1 = require('./PascalParser');
var parsersBundle_1 = require('./parsersBundle');
var MessageType_1 = require('../../message/MessageType');
var Message_1 = require('../../message/Message');
var Predefined_1 = require('../../intermediate/symtabimpl/Predefined');
var PascalParserTD = (function (_super) {
    __extends(PascalParserTD, _super);
    function PascalParserTD(param) {
        if (param instanceof PascalParserTD) {
            _super.call(this, param.getScanner());
        }
        else {
            _super.call(this, param);
        }
    }
    PascalParserTD.prototype.parse = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i - 0] = arguments[_i];
        }
        var token;
        Predefined_1.Predefined.initialize(PascalParserTD.symTabStack);
        try {
            var token_1 = this.nextToken();
            var programParser = new parsersBundle_1.ProgramParser(this);
            programParser.parse(token_1, undefined);
            token_1 = this.currentToken();
            var elapsedTime = 0;
            this.sendMessage(new Message_1.Message(MessageType_1.MessageType.PARSER_SUMMARY, [token_1.getLineNumber(),
                this.getErrorCount(),
                elapsedTime]));
        }
        catch (ex) {
            console.error('Error!!!!!!!!');
            console.info(ex);
            PascalParserTD.errorHandler.abortTranslation(PascalErrorCode_1.PascalErrorCode.IO_ERROR, this);
        }
    };
    return PascalParserTD;
}(PascalParser_1.PascalParser));
exports.PascalParserTD = PascalParserTD;
//# sourceMappingURL=PascalParserTD.js.map