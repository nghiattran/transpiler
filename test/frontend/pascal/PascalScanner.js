"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Scanner_1 = require('../Scanner');
var Source_1 = require('../Source');
var Token_1 = require('../Token');
var EofToken_1 = require('../EofToken');
var PascalScanner = (function (_super) {
    __extends(PascalScanner, _super);
    /**
     * Constructor
     * @param source the source to be used with this scanner.
     */
    function PascalScanner(source) {
        _super.call(this, source);
    }
    /**
     * Extract and return the next Pascal token from the source.
     * @return the next token.
     * @throws Exception if an error occurred.
     */
    PascalScanner.prototype.extractToken = function () {
        var token;
        var currentChar = this.currentChar();
        // Construct the next token.  The current character determines the
        // token type.
        if (currentChar == Source_1.Source.EOF) {
            token = new EofToken_1.EofToken(this.source);
        }
        else {
            token = new Token_1.Token(this.source);
        }
        return token;
    };
    return PascalScanner;
}(Scanner_1.Scanner));
exports.PascalScanner = PascalScanner;
