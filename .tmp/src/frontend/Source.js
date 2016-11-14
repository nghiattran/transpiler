"use strict";
var Message_1 = require("../message/Message");
var MessageHandler_1 = require("../message/MessageHandler");
var MessageType_1 = require("../message/MessageType");
var Source = (function () {
    function Source(text) {
        this.text = text;
        this.lineNum = 0;
        this.currentPos = -2;
        this.messageHandler = new MessageHandler_1.MessageHandler();
        this.globalPos = 0;
    }
    Source.prototype.getLineNum = function () {
        return this.lineNum;
    };
    Source.prototype.getPosition = function () {
        return this.currentPos;
    };
    Source.prototype.currentChar = function () {
        if (this.currentPos === -2) {
            this.readLine();
            return this.nextChar();
        }
        else if (this.line === undefined) {
            return Source.EOF;
        }
        else if ((this.currentPos === -1) || (this.currentPos === this.line.length)) {
            return Source.EOL;
        }
        else if (this.currentPos > this.line.length) {
            this.readLine();
            return this.nextChar();
        }
        else {
            return this.line.charAt(this.currentPos);
        }
    };
    Source.prototype.nextChar = function () {
        ++this.currentPos;
        return this.currentChar();
    };
    Source.prototype.peekChar = function () {
        this.currentChar();
        if (this.line === undefined) {
            return Source.EOF;
        }
        var nextPos = this.currentPos + 1;
        return nextPos < this.line.length ? this.line.charAt(nextPos) : Source.EOL;
    };
    Source.prototype.atEol = function () {
        return (this.line !== undefined) && (this.currentPos === this.line.length);
    };
    Source.prototype.atEof = function () {
        if (this.currentPos === -2) {
            this.readLine();
        }
        return this.line === undefined;
    };
    Source.prototype.skipToNextLine = function () {
        if (this.line !== undefined) {
            this.currentPos = this.line.length + 1;
        }
    };
    Source.prototype.readALine = function () {
        var line = '';
        if (this.globalPos >= this.text.length) {
            return undefined;
        }
        while (this.text.charAt(this.globalPos) !== Source.EOL
            && this.globalPos < this.text.length) {
            line += this.text.charAt(this.globalPos);
            this.globalPos++;
        }
        this.globalPos++;
        return line;
    };
    Source.prototype.readLine = function () {
        this.line = this.readALine();
        this.currentPos = -1;
        if (this.line !== undefined) {
            ++this.lineNum;
        }
        if (this.line !== undefined) {
            this.sendMessage(new Message_1.Message(MessageType_1.MessageType.SOURCE_LINE, [this.lineNum, this.line]));
        }
    };
    Source.prototype.close = function () {
    };
    Source.prototype.addMessageListener = function (listener) {
        this.messageHandler.addListener(listener);
    };
    Source.prototype.removeMessageListener = function (listener) {
        this.messageHandler.removeListener(listener);
    };
    Source.prototype.sendMessage = function (message) {
        this.messageHandler.sendMessage(message);
    };
    Source.EOL = '\n';
    Source.EOF = 'EOF';
    return Source;
}());
exports.Source = Source;
//# sourceMappingURL=Source.js.map