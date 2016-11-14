"use strict";
var Token = (function () {
    function Token(source) {
        this.source = source;
        this.lineNum = source.getLineNum();
        this.position = source.getPosition();
        this.extract();
    }
    Token.prototype.getType = function () {
        return this.type;
    };
    Token.prototype.getText = function () {
        return this.text;
    };
    Token.prototype.getValue = function () {
        return this.value;
    };
    Token.prototype.getLineNumber = function () {
        return this.lineNum;
    };
    Token.prototype.getPosition = function () {
        return this.position;
    };
    Token.prototype.extract = function () {
        this.text = this.currentChar();
        this.value = undefined;
        this.nextChar();
    };
    Token.prototype.currentChar = function () {
        return this.source.currentChar();
    };
    Token.prototype.nextChar = function () {
        return this.source.nextChar();
    };
    Token.prototype.peekChar = function () {
        return this.source.peekChar();
    };
    return Token;
}());
exports.Token = Token;
//# sourceMappingURL=Token.js.map