"use strict";
var TreeMap = (function () {
    function TreeMap() {
        this.collection = {};
    }
    TreeMap.prototype.containsKey = function (key) {
        return this.collection[key] !== undefined;
    };
    TreeMap.prototype.setAttribute = function (key, value) {
        this.put(key, value);
    };
    TreeMap.prototype.getAttribute = function (key) {
        return this.get(key);
    };
    TreeMap.prototype.put = function (key, value) {
        this.collection[key] = value;
    };
    TreeMap.prototype.get = function (key) {
        return this.collection[key];
    };
    TreeMap.prototype.toList = function () {
        var list = [];
        for (var entry in this.collection) {
            list.push(this.collection[entry]);
        }
        return list;
    };
    return TreeMap;
}());
exports.TreeMap = TreeMap;
//# sourceMappingURL=TreeMap.js.map