"use strict";
var MessageHandler_1 = require("../message/MessageHandler");
var SymTabFactory_1 = require("../intermediate/SymTabFactory");
var Parser = (function () {
    function Parser(scanner) {
        this.scanner = scanner;
    }
    Parser.prototype.getScanner = function () {
        return this.scanner;
    };
    Parser.prototype.getSymTabStack = function () {
        return Parser.symTabStack;
    };
    Parser.prototype.getMessageHandler = function () {
        return Parser.messageHandler;
    };
    Parser.prototype.currentToken = function () {
        return this.scanner.getCurrentToken();
    };
    Parser.prototype.nextToken = function () {
        return this.scanner.nextToken();
    };
    Parser.prototype.addMessageListener = function (listener) {
        Parser.messageHandler.addListener(listener);
    };
    Parser.prototype.removeMessageListener = function (listener) {
        Parser.messageHandler.removeListener(listener);
    };
    Parser.prototype.sendMessage = function (message) {
        Parser.messageHandler.sendMessage(message);
    };
    Parser.symTabStack = SymTabFactory_1.SymTabFactory.createSymTabStack();
    Parser.messageHandler = new MessageHandler_1.MessageHandler();
    return Parser;
}());
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map