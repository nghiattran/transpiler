"use strict";
var List = (function () {
    function List() {
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
