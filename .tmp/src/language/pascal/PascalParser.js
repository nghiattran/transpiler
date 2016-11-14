"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PascalErrorHandler_1 = require('./PascalErrorHandler');
var PascalErrorCode_1 = require('./PascalErrorCode');
var Parser_1 = require('../../frontend/Parser');
var EofToken_1 = require('../../frontend/EofToken');
var PascalParser = (function (_super) {
    __extends(PascalParser, _super);
    function PascalParser(param) {
        if (param instanceof PascalParser) {
            _super.call(this, param.getScanner());
        }
        else {
            _super.call(this, param);
        }
    }
    PascalParser.prototype.parse = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i - 0] = arguments[_i];
        }
    };
    PascalParser.prototype.getErrorCount = function () {
        return PascalParser.errorHandler.getErrorCount();
    };
    PascalParser.prototype.synchronize = function (syncSet) {
        var token = this.currentToken();
        if (!syncSet.contains(token.getType())) {
            PascalParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.UNEXPECTED_TOKEN, this);
            do {
                token = this.nextToken();
            } while (!(token instanceof EofToken_1.EofToken) &&
                !syncSet.contains(token.getType()));
        }
        return token;
    };
    PascalParser.errorHandler = new PascalErrorHandler_1.PascalErrorHandler();
    return PascalParser;
}(Parser_1.Parser));
exports.PascalParser = PascalParser;
//# sourceMappingURL=PascalParser.js.map