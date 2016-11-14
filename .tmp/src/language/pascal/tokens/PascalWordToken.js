"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PascalToken_1 = require('../PascalToken');
var PascalTokenType_1 = require('../PascalTokenType');
var Util_1 = require('../../../util/Util');
var PascalWordToken = (function (_super) {
    __extends(PascalWordToken, _super);
    function PascalWordToken(source) {
        _super.call(this, source);
    }
    PascalWordToken.prototype.extract = function () {
        var textBuffer = '';
        var currentChar = this.currentChar();
        while (Util_1.Util.isLetterOrDigit(currentChar)) {
            textBuffer += currentChar;
            currentChar = this.nextChar();
        }
        this.text = textBuffer.toString();
        if (PascalTokenType_1.PascalTokenType.RESERVED_WORDS.indexOf(PascalTokenType_1.PascalTokenType[this.text.toUpperCase()]) !== -1) {
            this.type = PascalTokenType_1.PascalTokenType[this.text.toUpperCase()];
        }
        else {
            this.type = PascalTokenType_1.PascalTokenType.IDENTIFIER;
        }
    };
    return PascalWordToken;
}(PascalToken_1.PascalToken));
exports.PascalWordToken = PascalWordToken;
//# sourceMappingURL=PascalWordToken.js.map