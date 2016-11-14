"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PascalToken_1 = require('../PascalToken');
var PascalErrorCode_1 = require('../PascalErrorCode');
var PascalTokenType_1 = require('../PascalTokenType');
var Util_1 = require('../../../util/Util');
var PascalNumberToken = (function (_super) {
    __extends(PascalNumberToken, _super);
    function PascalNumberToken(source) {
        _super.call(this, source);
    }
    PascalNumberToken.prototype.extract = function () {
        var textBuffer = '';
        this.extractNumber(textBuffer);
        this.text = textBuffer.toString();
    };
    PascalNumberToken.prototype.extractNumber = function (textBuffer) {
        var wholeDigits = undefined;
        var fractionDigits = undefined;
        var exponentDigits = undefined;
        var exponentSign = '+';
        var sawDotDot = false;
        var currentChar;
        this.type = PascalTokenType_1.PascalTokenType.INTEGER;
        wholeDigits = this.unsignedIntegerDigits(textBuffer);
        if (this.type === PascalTokenType_1.PascalTokenType.ERROR) {
            return;
        }
        currentChar = this.currentChar();
        if (currentChar === '.') {
            if (this.peekChar() === '.') {
                sawDotDot = true;
            }
            else {
                this.type = PascalTokenType_1.PascalTokenType.REAL;
                textBuffer += currentChar;
                currentChar = this.nextChar();
                fractionDigits = this.unsignedIntegerDigits(textBuffer);
                if (this.type === PascalTokenType_1.PascalTokenType.ERROR) {
                    return;
                }
            }
        }
        currentChar = this.currentChar();
        if (!sawDotDot && ((currentChar === 'E') || (currentChar === 'e'))) {
            this.type = PascalTokenType_1.PascalTokenType.REAL;
            textBuffer += currentChar;
            currentChar = this.nextChar();
            if ((currentChar === '+') || (currentChar === '-')) {
                textBuffer += currentChar;
                exponentSign = currentChar;
                currentChar = this.nextChar();
            }
            exponentDigits = this.unsignedIntegerDigits(textBuffer);
        }
        if (this.type === PascalTokenType_1.PascalTokenType.INTEGER) {
            var integerValue = this.computeIntegerValue(wholeDigits);
            if (this.type !== PascalTokenType_1.PascalTokenType.ERROR) {
                this.value = Math.floor(integerValue);
            }
        }
        else if (this.type === PascalTokenType_1.PascalTokenType.REAL) {
            var floatValue = this.computeFloatValue(wholeDigits, fractionDigits, exponentDigits, exponentSign);
            if (this.type !== PascalTokenType_1.PascalTokenType.ERROR) {
                this.value = floatValue;
            }
        }
    };
    PascalNumberToken.prototype.unsignedIntegerDigits = function (textBuffer) {
        var currentChar = this.currentChar();
        if (!Util_1.Util.isDigit(currentChar)) {
            this.type = PascalTokenType_1.PascalTokenType.ERROR;
            this.value = PascalErrorCode_1.PascalErrorCode.INVALID_NUMBER;
            return undefined;
        }
        var digits = '';
        while (Util_1.Util.isDigit(currentChar)) {
            textBuffer += currentChar;
            digits += currentChar;
            currentChar = this.nextChar();
        }
        return digits.toString();
    };
    PascalNumberToken.prototype.computeIntegerValue = function (digits) {
        if (digits === undefined) {
            return 0;
        }
        var integerValue = 0;
        var prevValue = -1;
        var index = 0;
        while ((index < digits.length) && (integerValue >= prevValue)) {
            prevValue = integerValue;
            integerValue = 10 * integerValue +
                Util_1.Util.getNumericValue(digits.charAt(index++));
        }
        if (integerValue >= prevValue) {
            return integerValue;
        }
        else {
            this.type = PascalTokenType_1.PascalTokenType.ERROR;
            this.value = PascalErrorCode_1.PascalErrorCode.RANGE_INTEGER;
            return 0;
        }
    };
    PascalNumberToken.prototype.computeFloatValue = function (wholeDigits, fractionDigits, exponentDigits, exponentSign) {
        var floatValue = 0.0;
        var exponentValue = this.computeIntegerValue(exponentDigits);
        var digits = wholeDigits;
        if (exponentSign === '-') {
            exponentValue = -exponentValue;
        }
        if (fractionDigits !== undefined) {
            exponentValue -= fractionDigits.length;
            digits += fractionDigits;
        }
        if (Math.abs(exponentValue + wholeDigits.length) > PascalNumberToken.MAX_EXPONENT) {
            this.type = PascalTokenType_1.PascalTokenType.ERROR;
            this.value = PascalErrorCode_1.PascalErrorCode.RANGE_REAL;
            return 0;
        }
        var index = 0;
        while (index < digits.length) {
            floatValue = 10 * floatValue +
                Util_1.Util.getNumericValue(digits.charAt(index++));
        }
        if (exponentValue !== 0) {
            floatValue *= Math.pow(10, exponentValue);
        }
        return floatValue;
    };
    PascalNumberToken.MAX_EXPONENT = 37;
    return PascalNumberToken;
}(PascalToken_1.PascalToken));
exports.PascalNumberToken = PascalNumberToken;
//# sourceMappingURL=PascalNumberToken.js.map