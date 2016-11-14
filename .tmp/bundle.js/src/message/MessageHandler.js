"use strict";
var MessageHandler = (function () {
    function MessageHandler() {
        this.listeners = [];
    }
    MessageHandler.prototype.addListener = function (listener) {
        this.listeners.push(listener);
    };
    MessageHandler.prototype.removeListener = function (listener) {
        var index = this.listeners.indexOf(listener, 0);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    };
    MessageHandler.prototype.sendMessage = function (message) {
        this.message = message;
        this.notifyListeners();
    };
    MessageHandler.prototype.notifyListeners = function () {
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i].messageReceived(this.message);
        }
    };
    return MessageHandler;
}());
exports.MessageHandler = MessageHandler;
//# sourceMappingURL=MessageHandler.js.map