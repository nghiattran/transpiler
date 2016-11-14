"use strict";
var Message = (function () {
    function Message(type, body) {
        this.type = type;
        this.body = body;
    }
    Message.prototype.getType = function () {
        return this.type;
    };
    Message.prototype.getBody = function () {
        return this.body;
    };
    return Message;
}());
exports.Message = Message;
//# sourceMappingURL=Message.js.map