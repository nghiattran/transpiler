"use strict";
var Scanner = (function () {
    function Scanner(source) {
        this.setSource(source);
    }
    Scanner.prototype.setSource = function (source) {
        this.source = source;
    };
    Scanner.prototype.getCurrentToken = function () {
        return this.currentToken;
    };
    Scanner.prototype.nextToken = function () {
        this.currentToken = this.extractToken();
        return this.currentToken;
    };
    Scanner.prototype.currentChar = function () {
        return this.source.currentChar();
    };
    Scanner.prototype.nextChar = function () {
        return this.source.nextChar();
    };
    Scanner.prototype.atEol = function () {
        return this.source.atEol();
    };
    Scanner.prototype.atEof = function () {
        return this.source.atEof();
    };
    Scanner.prototype.skipToNextLine = function () {
        this.source.skipToNextLine();
    };
    return Scanner;
}());
exports.Scanner = Scanner;
//# sourceMappingURL=Scanner.js.map