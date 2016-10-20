"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Token_1 = require("./Token");
var EofToken = (function (_super) {
    __extends(EofToken, _super);
    /**
     * Constructor.
     * @param source the source from where to fetch subsequent characters.
     * @throws Exception if an error occurred.
     */
    function EofToken(source) {
        _super.call(this, source);
    }
    /**
     * Do nothing.  Do not consume any source characters.
     * @param source the source from where to fetch the token's characters.
     * @throws Exception if an error occurred.
     */
    EofToken.prototype.extract = function () {
    };
    return EofToken;
}(Token_1.Token));
exports.EofToken = EofToken;
