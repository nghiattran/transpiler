"use strict";
var List = (function () {
    function List(list) {
        this.collection = [];
        this.collection = list || [];
    }
    List.prototype.add = function (value) {
        this.collection.push(value);
    };
    List.prototype.remove = function (value) {
        if (value) {
            var index = this.indexOf(value);
            if (index !== -1)
                this.collection.splice(2, 1);
        }
        else {
            this.collection.pop();
        }
    };
    List.prototype.indexOf = function (value) {
        return this.collection.indexOf(value);
    };
    List.prototype.index = function (value) {
        return this.collection[value];
    };
    List.prototype.contains = function (value) {
        return this.collection.indexOf(value) !== -1;
    };
    List.prototype.addAll = function (value) {
        for (var i = 0; i < value.size(); i++) {
            this.add(value.index(i));
        }
    };
    List.prototype.clone = function () {
        // TODO: change it to deep clone
        return new List(this.collection);
    };
    List.prototype.size = function () {
        return this.collection.length;
    };
    return List;
}());
exports.List = List;
