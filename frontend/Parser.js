"use strict";
var MessageHandler_1 = require("../message/MessageHandler");
var SymTabFactorylocation_1 = require("SymTabFactorylocation");
/**
 * <h1>Parser</h1>
 *
 * <p>A language-independent framework class.  This abstract parser class
 * will be implemented by language-specific subclasses.</p>
 *
 * <p>Copyright (c) 2009 by Ronald Mak</p>
 * <p>For instructional purposes only.  No warranties.</p>
 */
var Parser = (function () {
    /**
     * Constructor.
     * @param scanner the scanner to be used with this parser.
     */
    function Parser(scanner) {
        this.scanner = scanner;
    }
    /**
     * Getter.
     * @return the scanner used by this parser.
     */
    Parser.prototype.getScanner = function () {
        return this.scanner;
    };
    /**
     * Getter.
     * @return the symbol table stack generated by this parser.
     */
    Parser.prototype.getSymTabStack = function () {
        return Parser.symTabStack;
    };
    /**
     * Getter.
     * @return the message handler.
     */
    Parser.prototype.getMessageHandler = function () {
        return Parser.messageHandler;
    };
    /**
     * Call the scanner's currentToken() method.
     * @return the current token.
     */
    Parser.prototype.currentToken = function () {
        return this.scanner.getCurrentToken();
    };
    /**
     * Call the scanner's nextToken() method.
     * @return the next token.
     * @throws Exception if an error occurred.
     */
    Parser.prototype.nextToken = function () {
        return this.scanner.nextToken();
    };
    /**
     * Add a parser message listener.
     * @param listener the message listener to add.
     */
    Parser.prototype.addMessageListener = function (listener) {
        Parser.messageHandler.addListener(listener);
    };
    /**
     * Remove a parser message listener.
     * @param listener the message listener to remove.
     */
    Parser.prototype.removeMessageListener = function (listener) {
        Parser.messageHandler.removeListener(listener);
    };
    /**
     * Notify listeners after setting the message.
     * @param message the message to set.
     */
    Parser.prototype.sendMessage = function (message) {
        Parser.messageHandler.sendMessage(message);
    };
    Parser.symTabStack = SymTabFactorylocation_1["default"].createSymTabStack(); // symbol table stack
    Parser.messageHandler = new MessageHandler_1.MessageHandler(); // message handler delegate
    return Parser;
}());
exports.Parser = Parser;