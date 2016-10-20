"use strict";
var HashMap = (function () {
    function HashMap() {
    }
    /**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    HashMap.prototype.setAttribute = function (key, value) {
        this.collection[key.toString()] = value;
    };
    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    HashMap.prototype.getAttribute = function (key) {
        return this.collection[key.toString()];
    };
    /**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    HashMap.prototype.put = function (key, value) {
        this.collection[key.toString()] = value;
    };
    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    HashMap.prototype.get = function (key) {
        return this.collection[key.toString()];
    };
    HashMap.prototype.toList = function () {
        var list = [];
        for (var entry in this.collection) {
            list.push(this.collection[entry]);
        }
        return list;
    };
    return HashMap;
}());
exports.HashMap = HashMap;
