"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PascalToken_1 = require('../PascalToken');
var PascalErrorCode_1 = require('../PascalErrorCode');
var PascalTokenType_1 = require('../PascalTokenType');
var PascalSpecialSymbolToken = (function (_super) {
    __extends(PascalSpecialSymbolToken, _super);
    function PascalSpecialSymbolToken(source) {
        _super.call(this, source);
    }
    PascalSpecialSymbolToken.prototype.extract = function () {
        var currentChar = this.currentChar();
        this.text = currentChar;
        this.type = undefined;
        switch (currentChar) {
            case '+':
            case '-':
            case '*':
            case '/':
            case ',':
            case ';':
            case '\'':
            case '=':
            case '(':
            case ')':
            case '[':
            case ']':
            case '{':
            case '}':
            case '^': {
                this.nextChar();
                break;
            }
            case ':': {
                currentChar = this.nextChar();
                if (currentChar === '=') {
                    this.text += currentChar;
                    this.nextChar();
                }
                break;
            }
            case '<': {
                currentChar = this.nextChar();
                if (currentChar === '=') {
                    this.text += currentChar;
                    this.nextChar();
                }
                else if (currentChar === '>') {
                    this.text += currentChar;
                    this.nextChar();
                }
                break;
            }
            case '>': {
                currentChar = this.nextChar();
                if (currentChar === '=') {
                    this.text += currentChar;
                    this.nextChar();
                }
                break;
            }
            case '.': {
                currentChar = this.nextChar();
                if (currentChar === '.') {
                    this.text += currentChar;
                    this.nextChar();
                }
                break;
            }
            default: {
                this.nextChar();
                this.type = PascalTokenType_1.PascalTokenType.ERROR;
                this.value = PascalErrorCode_1.PascalErrorCode.INVALID_CHARACTER;
            }
        }
        if (this.type === undefined) {
            this.type = PascalTokenType_1.PascalTokenType.SPECIAL_SYMBOLS.get(this.text);
        }
    };
    return PascalSpecialSymbolToken;
}(PascalToken_1.PascalToken));
exports.PascalSpecialSymbolToken = PascalSpecialSymbolToken;
//# sourceMappingURL=PascalSpecialSymbolToken.js.map