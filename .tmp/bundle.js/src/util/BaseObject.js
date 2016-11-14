"use strict";
var TreeMap_1 = require('./TreeMap');
if (!Date.now) {
    Date.now = function () { return new Date().getTime(); };
}
var BaseObject = (function () {
    function BaseObject() {
        this.hashCode = Date.now().toString() + BaseObject.counter++;
        BaseObject.objectPool.setAttribute(this.hashCode, this);
    }
    BaseObject.prototype.getHash = function () {
        return this.hashCode;
    };
    BaseObject.getObject = function (key) {
        return BaseObject.objectPool.getAttribute(key);
    };
    BaseObject.objectPool = new TreeMap_1.TreeMap();
    BaseObject.counter = 0;
    return BaseObject;
}());
exports.BaseObject = BaseObject;
//# sourceMappingURL=BaseObject.js.map