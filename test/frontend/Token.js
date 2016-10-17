"use strict";
/**
 * <h1>Token</h1>
 *
 * <p>The framework class that represents a token returned by the scanner.</p>
 *
 * <p>Copyright (c) 2009 by Ronald Mak</p>
 * <p>For instructional purposes only.  No warranties.</p>
 */
var Token = (function () {
    /**
     * Constructor.
     * @param source the source from where to fetch the token's characters.
     * @throws Exception if an error occurred.
     */
    function Token(source) {
        this.source = source;
        this.lineNum = source.getLineNum();
        this.position = source.getPosition();
        this.extract();
    }
    /**
     * Getter
     * @return the token type
     */
    Token.prototype.getType = function () {
        return this.type;
    };
    /**
     * Getter.
     * @return the token text.
     */
    Token.prototype.getText = function () {
        return this.text;
    };
    /**
     * Getter.
     * @return the token value.
     */
    Token.prototype.getValue = function () {
        return this.value;
    };
    /**
     * Getter.
     * @return the source line number.
     */
    Token.prototype.getLineNumber = function () {
        return this.lineNum;
    };
    /**
     * Getter.
     * @return the position.
     */
    Token.prototype.getPosition = function () {
        return this.position;
    };
    /**
     * Default method to extract only one-character tokens from the source.
     * Subclasses can override this method to construct language-specific
     * tokens.  After extracting the token, the current source line position
     * will be one beyond the last token character.
     * @throws Exception if an error occurred.
     */
    Token.prototype.extract = function () {
        this.text = this.currentChar();
        this.value = null;
        this.nextChar(); // consume current character
    };
    /**
     * Call the source's currentChar() method.
     * @return the current character from the source.
     * @throws Exception if an error occurred.
     */
    Token.prototype.currentChar = function () {
        return this.source.currentChar();
    };
    /**
     * Call the source's nextChar() method.
     * @return the next character from the source after moving forward.
     * @throws Exception if an error occurred.
     */
    Token.prototype.nextChar = function () {
        return this.source.nextChar();
    };
    /**
     * Call the source's peekChar() method.
     * @return the next character from the source without moving forward.
     * @throws Exception if an error occurred.
     */
    Token.prototype.peekChar = function () {
        return this.source.peekChar();
    };
    return Token;
}());
exports.Token = Token;
