"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Token_1 = require('../../frontend/Token');
var PascalToken = (function (_super) {
    __extends(PascalToken, _super);
    function PascalToken(source) {
        _super.call(this, source);
    }
    return PascalToken;
}(Token_1.Token));
exports.PascalToken = PascalToken;
//# sourceMappingURL=PascalToken.js.map