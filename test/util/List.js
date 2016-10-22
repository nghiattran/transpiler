"use strict";
var List = (function () {
    function List(list) {
        this.collection = [];
        this.collection = list;
    }
    List.prototype.add = function (value) {
        this.collection.push(value);
    };
    List.prototype.remove = function () {
        this.collection.pop();
    };
    List.prototype.indexOf = function (value) {
        return this.collection.indexOf(value);
    };
    List.prototype.contains = function (value) {
        return this.collection.indexOf(value) !== -1;
    };
    List.prototype.clone = function () {
        return new List(this.collection);
    };
    return List;
}());
exports.List = List;
