"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PascalToken_1 = require('../PascalToken');
var PascalTokenType_1 = require('../PascalTokenType');
var PascalErrorToken = (function (_super) {
    __extends(PascalErrorToken, _super);
    function PascalErrorToken(source, errorCode, tokenText) {
        _super.call(this, source);
        this.text = tokenText;
        this.type = PascalTokenType_1.PascalTokenType.ERROR;
        this.value = errorCode;
    }
    PascalErrorToken.prototype.extract = function () {
    };
    return PascalErrorToken;
}(PascalToken_1.PascalToken));
exports.PascalErrorToken = PascalErrorToken;
//# sourceMappingURL=PascalErrorToken.js.map