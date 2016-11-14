"use strict";
var List = (function () {
    function List(list) {
        this.collection = [];
        this.collection = list || [];
    }
    List.prototype.add = function (value) {
        if (!this.contains(value)) {
            this.collection.push(value);
        }
    };
    List.prototype.removeIndex = function (index) {
        this.remove(this.get(index));
    };
    List.prototype.remove = function (value) {
        if (value) {
            var index = this.indexOf(value);
            if (index !== -1)
                this.collection.splice(index, 1);
        }
        else {
            this.collection.pop();
        }
    };
    List.prototype.get = function (value) {
        return this.index(value);
    };
    List.prototype.indexOf = function (value) {
        return this.collection.indexOf(value);
    };
    List.prototype.index = function (value) {
        return this.collection[value];
    };
    List.prototype.contains = function (value) {
        return this.indexOf(value) !== -1;
    };
    List.prototype.addAll = function (value) {
        for (var i = 0; i < value.size(); i++) {
            if (!this.contains(value[i])) {
                this.add(value.index(i));
            }
        }
    };
    List.prototype.clone = function () {
        return new List(this.collection.slice(0));
    };
    List.prototype.size = function () {
        return this.collection.length;
    };
    return List;
}());
exports.List = List;
//# sourceMappingURL=List.js.map