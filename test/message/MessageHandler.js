"use strict";
var MessageHandler = (function () {
    /**
     * Constructor.
     */
    function MessageHandler() {
        this.listeners = []; // listener list
    }
    /**
     * Add a listener to the listener list.
     * @param listener the listener to add.
     */
    MessageHandler.prototype.addListener = function (listener) {
        this.listeners.push(listener);
    };
    /**
     * Remove a listener from the listener list.
     * @param listener the listener to remove.
     */
    MessageHandler.prototype.removeListener = function (listener) {
        var index = this.listeners.indexOf(listener, 0);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    };
    /**
     * Notify listeners after setting the message.
     * @param message the message to set.
     */
    MessageHandler.prototype.sendMessage = function (message) {
        this.message = message;
        this.notifyListeners();
    };
    /**
     * Notify each listener in the listener list by calling the listener's
     * messageReceived() method.
     */
    MessageHandler.prototype.notifyListeners = function () {
        for (var listener in this.listeners) {
        }
    };
    return MessageHandler;
}());
exports.MessageHandler = MessageHandler;
