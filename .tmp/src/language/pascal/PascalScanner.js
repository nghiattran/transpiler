"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Scanner_1 = require('../../frontend/Scanner');
var Source_1 = require('../../frontend/Source');
var EofToken_1 = require('../../frontend/EofToken');
var PascalTokenType_1 = require('./PascalTokenType');
var PascalErrorCode_1 = require('./PascalErrorCode');
var PascalWordToken_1 = require('./tokens/PascalWordToken');
var PascalNumberToken_1 = require('./tokens/PascalNumberToken');
var PascalStringToken_1 = require('./tokens/PascalStringToken');
var PascalErrorToken_1 = require('./tokens/PascalErrorToken');
var PascalSpecialSymbolToken_1 = require('./tokens/PascalSpecialSymbolToken');
var Util_1 = require('../../util/Util');
var PascalScanner = (function (_super) {
    __extends(PascalScanner, _super);
    function PascalScanner(source) {
        _super.call(this, source);
    }
    PascalScanner.prototype.extractToken = function () {
        this.skipWhiteSpace();
        var token;
        var currentChar = this.currentChar();
        if (currentChar === Source_1.Source.EOF) {
            token = new EofToken_1.EofToken(this.source);
        }
        else if (Util_1.Util.isLetter(currentChar)) {
            token = new PascalWordToken_1.PascalWordToken(this.source);
        }
        else if (Util_1.Util.isDigit(currentChar)) {
            token = new PascalNumberToken_1.PascalNumberToken(this.source);
        }
        else if (currentChar === '\'') {
            token = new PascalStringToken_1.PascalStringToken(this.source);
        }
        else if (PascalTokenType_1.PascalTokenType.SPECIAL_SYMBOLS
            .containsKey(currentChar)) {
            token = new PascalSpecialSymbolToken_1.PascalSpecialSymbolToken(this.source);
        }
        else {
            token = new PascalErrorToken_1.PascalErrorToken(this.source, PascalErrorCode_1.PascalErrorCode.INVALID_CHARACTER, currentChar);
            this.nextChar();
        }
        return token;
    };
    PascalScanner.prototype.skipWhiteSpace = function () {
        var currentChar = this.currentChar();
        while (currentChar === '\n' || currentChar === ' ' || currentChar === '\t' || (currentChar === '{')) {
            if (currentChar === '{') {
                do {
                    currentChar = this.nextChar();
                } while ((currentChar !== '}') && (currentChar !== Source_1.Source.EOF));
                if (currentChar === '}') {
                    currentChar = this.nextChar();
                }
            }
            else {
                currentChar = this.nextChar();
            }
        }
    };
    return PascalScanner;
}(Scanner_1.Scanner));
exports.PascalScanner = PascalScanner;
//# sourceMappingURL=PascalScanner.js.map