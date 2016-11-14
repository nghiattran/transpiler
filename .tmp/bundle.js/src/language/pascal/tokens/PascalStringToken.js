"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PascalToken_1 = require('../PascalToken');
var PascalErrorCode_1 = require('../PascalErrorCode');
var PascalTokenType_1 = require('../PascalTokenType');
var Source_1 = require('../../../frontend/Source');
var PascalStringToken = (function (_super) {
    __extends(PascalStringToken, _super);
    function PascalStringToken(source) {
        _super.call(this, source);
    }
    PascalStringToken.prototype.extract = function () {
        var textBuffer = '';
        var valueBuffer = '';
        var currentChar = this.nextChar();
        textBuffer += '\'';
        do {
            if (currentChar === ' ') {
                currentChar = ' ';
            }
            if ((currentChar !== '\'') && (currentChar !== Source_1.Source.EOF)) {
                textBuffer += currentChar;
                valueBuffer += currentChar;
                currentChar = this.nextChar();
            }
            if (currentChar === '\'') {
                while ((currentChar === '\'') && (this.peekChar() === '\'')) {
                    textBuffer += "''";
                    valueBuffer += currentChar;
                    currentChar = this.nextChar();
                    currentChar = this.nextChar();
                }
            }
        } while ((currentChar !== '\'') && (currentChar !== Source_1.Source.EOF));
        if (currentChar === '\'') {
            this.nextChar();
            textBuffer += '\'';
            this.type = PascalTokenType_1.PascalTokenType.STRING;
            this.value = valueBuffer;
        }
        else {
            this.type = PascalTokenType_1.PascalTokenType.ERROR;
            this.value = PascalErrorCode_1.PascalErrorCode.UNEXPECTED_EOF;
        }
        this.text = textBuffer.toString();
    };
    return PascalStringToken;
}(PascalToken_1.PascalToken));
exports.PascalStringToken = PascalStringToken;
//# sourceMappingURL=PascalStringToken.js.map