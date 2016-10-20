"use strict";
var List = (function () {
    function List() {
        this.collection = [];
    }
    List.prototype.add = function (value) {
        this.collection.push(value);
    };
    List.prototype.remove = function () {
        this.collection.pop();
    };
    return List;
}());
exports.List = List;
