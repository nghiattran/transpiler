"use strict";
var Message_1 = require("../message/Message");
var MessageHandler_1 = require("../message/MessageHandler");
var MessageType_1 = require("../message/MessageType");
/**
 * <h1>Source</h1>
 *
 * <p>The framework class that represents the source program.</p>
 *
 * <p>Copyright (c) 2009 by Ronald Mak</p>
 * <p>For instructional purposes only.  No warranties.</p>
 */
var Source = (function () {
    /**
     * Constructor.
     * @param reader the reader for the source program
     * @throws IOException if an I/O error occurred
     */
    // public constructor(BufferedReader reader)
    function Source(text) {
        this.text = text;
        this.lineNum = 0;
        this.currentPos = -2; // set to -2 to read the first source line
        this.messageHandler = new MessageHandler_1.MessageHandler();
        this.globalPos = 0;
    }
    /**
     * Getter.
     * @return the current source line number.
     */
    Source.prototype.getLineNum = function () {
        return this.lineNum;
    };
    /**
     * Getter.
     * @return the position of the next source character in the
     * current source line.
     */
    Source.prototype.getPosition = function () {
        return this.currentPos;
    };
    /**
     * Return the source character at the current position.
     * @return the source character at the current position.
     * @throws Exception if an error occurred.
     */
    Source.prototype.currentChar = function () {
        // First time?
        if (this.currentPos === -2) {
            this.readLine();
            return this.nextChar();
        }
        else if (this.line === null) {
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
    /**
     * Consume the current source character and return the next character.
     * @return the next source character.
     * @throws Exception if an error occurred.
     */
    Source.prototype.nextChar = function () {
        ++this.currentPos;
        return this.currentChar();
    };
    /**
     * Return the source character following the current character without
     * consuming the current character.
     * @return the following character.
     * @throws Exception if an error occurred.
     */
    Source.prototype.peekChar = function () {
        this.currentChar();
        if (this.line === null) {
            return Source.EOF;
        }
        var nextPos = this.currentPos + 1;
        return nextPos < this.line.length ? this.line.charAt(nextPos) : Source.EOL;
    };
    /**
     * @return true if at the end of the line, else return false.
     * @throws Exception if an error occurred.
     */
    Source.prototype.atEol = function () {
        return (this.line != null) && (this.currentPos === this.line.length);
    };
    /**
     * @return true if at the end of the file, else return false.
     * @throws Exception if an error occurred.
     */
    Source.prototype.atEof = function () {
        // First time?
        if (this.currentPos === -2) {
            this.readLine();
        }
        return this.line === null;
    };
    /**
     * Skip the rest of the current input line
     * by forcing the next read to read a new line.
     * @throws Exception if an error occurred.
     */
    Source.prototype.skipToNextLine = function () {
        if (this.line != null) {
            this.currentPos = this.line.length + 1;
        }
    };
    Source.prototype.readALine = function () {
        var line = '';
        if (this.globalPos >= this.text.length) {
            return null;
        }
        while (this.text.charAt(this.globalPos) !== Source.EOL
            && this.globalPos < this.text.length) {
            line += this.text.charAt(this.globalPos);
            this.globalPos++;
        }
        this.globalPos++; // skip \n chacracter
        return line;
    };
    /**
     * Read the next source line.
     * @throws IOException if an I/O error occurred.
     */
    Source.prototype.readLine = function () {
        this.line = this.readALine(); // null when at the end of the source
        this.currentPos = -1;
        if (this.line != null) {
            ++this.lineNum;
        }
        // Send a source line message containing the line number
        // and the line text to all the listeners.
        if (this.line != null) {
            this.sendMessage(new Message_1.Message(MessageType_1.MessageType.SOURCE_LINE, [this.lineNum, this.line]));
        }
    };
    /**
     * Close the source.
     * @throws Exception if an error occurred.
     */
    Source.prototype.close = function () {
        // if (this.reader !== null) {
        //     try {
        //         this.reader.close();
        //     }
        //     catch (ex) {
        //         ex.printStackTrace();
        //         throw ex;
        //     }
        // }
    };
    /**
     * Add a parser message listener.
     * @param listener the message listener to add.
     */
    Source.prototype.addMessageListener = function (listener) {
        this.messageHandler.addListener(listener);
    };
    /**
     * Remove a parser message listener.
     * @param listener the message listener to remove.
     */
    Source.prototype.removeMessageListener = function (listener) {
        this.messageHandler.removeListener(listener);
    };
    /**
     * Notify listeners after setting the message.
     * @param message the message to set.
     */
    Source.prototype.sendMessage = function (message) {
        this.messageHandler.sendMessage(message);
    };
    Source.EOL = '\n'; // end-of-line character
    Source.EOF = 'EOF'; // end-of-file character
    return Source;
}());
exports.Source = Source;
