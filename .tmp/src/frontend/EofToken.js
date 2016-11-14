"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Token_1 = require("./Token");
var EofToken = (function (_super) {
    __extends(EofToken, _super);
    function EofToken(source) {
        _super.call(this, source);
    }
    EofToken.prototype.extract = function () {
    };
    return EofToken;
}(Token_1.Token));
exports.EofToken = EofToken;
//# sourceMappingURL=EofToken.js.map