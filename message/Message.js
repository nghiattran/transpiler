"use strict";
var Message = (function () {
    /**
     * Constructor.
     * @param type the message type.
     * @param body the message body.
     */
    function Message(type, body) {
        this.type = type;
        this.body = body;
    }
    /**
     * Getter.
     * @return the message type.
     */
    Message.prototype.getType = function () {
        return this.type;
    };
    /**
     * Getter.
     * @return the message body.
     */
    Message.prototype.getBody = function () {
        return this.body;
    };
    return Message;
}());
exports.Message = Message;
