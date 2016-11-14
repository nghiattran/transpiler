"use strict";
var ICodeImpl = (function () {
    function ICodeImpl() {
    }
    ICodeImpl.prototype.setRoot = function (node) {
        this.root = node;
        return this.root;
    };
    ICodeImpl.prototype.getRoot = function () {
        return this.root;
    };
    return ICodeImpl;
}());
exports.ICodeImpl = ICodeImpl;
//# sourceMappingURL=ICodeImpl.js.map