"use strict";
var Scanner = (function () {
    /**
     * Constructor
     * @param source the source to be used with this scanner.
     */
    function Scanner(source) {
        this.source = source;
    }
    /**
     * @return the current token.
     */
    Scanner.prototype.getCurrentToken = function () {
        return this.currentToken;
    };
    /**
     * Return next token from the source.
     * @return the next token.
     * @throws Exception if an error occurred.
     */
    Scanner.prototype.nextToken = function () {
        this.currentToken = this.extractToken();
        return this.currentToken;
    };
    /**
     * Call the source's currentChar() method.
     * @return the current character from the source.
     * @throws Exception if an error occurred.
     */
    Scanner.prototype.currentChar = function () {
        return this.source.currentChar();
    };
    /**
     * Call the source's nextChar() method.
     * @return the next character from the source.
     * @throws Exception if an error occurred.
     */
    Scanner.prototype.nextChar = function () {
        return this.source.nextChar();
    };
    /**
     * Call the source's atEol() method.
     * @return true if at the end of the source line, else return false.
     * @throws Exception if an error occurred.
     */
    Scanner.prototype.atEol = function () {
        return this.source.atEol();
    };
    /**
     * Call the source's atEof() method.
     * @return true if at the end of the source file, else return false.
     * @throws Exception if an error occurred.
     */
    Scanner.prototype.atEof = function () {
        return this.source.atEof();
    };
    /**
     * Call the source's skipToNextLine() method.
     * @throws Exception if an error occurred.
     */
    Scanner.prototype.skipToNextLine = function () {
        this.source.skipToNextLine();
    };
    return Scanner;
}());
exports.Scanner = Scanner;
