"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require('./BaseObject');
var HashMap = (function () {
    function HashMap() {
        this.collection = {};
    }
    HashMap.prototype.getKey = function (key) {
        if (key instanceof BaseObject_1.BaseObject) {
            return key.getHash();
        }
        throw 'Key must be a instance of BaseObject or a String.';
    };
    HashMap.prototype.setAttribute = function (key, value) {
        this.put(key, value);
    };
    HashMap.prototype.getAttribute = function (key) {
        return this.get(key);
    };
    HashMap.prototype.put = function (key, value) {
        this.collection[this.getKey(key)] = value;
    };
    HashMap.prototype.get = function (key) {
        return this.collection[this.getKey(key)];
    };
    HashMap.prototype.putKeyString = function (key, value) {
        this.collection[key] = value;
    };
    HashMap.prototype.getKeyString = function (key) {
        return this.collection[key];
    };
    HashMap.prototype.copy = function (copy) {
        for (var key in this.getKeys()) {
            copy.putKeyString(key, this.get[key]);
        }
    };
    HashMap.prototype.toList = function () {
        var list = [];
        for (var entry in this.collection) {
            list.push(this.collection[entry]);
        }
        return list;
    };
    HashMap.prototype.getKeys = function () {
        return Object.keys(this.collection);
    };
    HashMap.prototype.containsKey = function (key) {
        return this.collection[this.getKey(key)];
    };
    return HashMap;
}());
exports.HashMap = HashMap;
var HashSet = (function (_super) {
    __extends(HashSet, _super);
    function HashSet() {
        _super.apply(this, arguments);
    }
    return HashSet;
}(HashMap));
exports.HashSet = HashSet;
//# sourceMappingURL=HashMap.js.map