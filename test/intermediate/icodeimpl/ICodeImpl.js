"use strict";
var ICodeImpl = (function () {
    function ICodeImpl() {
    }
    /**
     * Set and return the root node.
     * @param node the node to set as root.
     * @return the root node.
     */
    ICodeImpl.prototype.setRoot = function (node) {
        this.root = node;
        return this.root;
    };
    /**
     * Get the root node.
     * @return the root node.
     */
    ICodeImpl.prototype.getRoot = function () {
        return this.root;
    };
    return ICodeImpl;
}());
exports.ICodeImpl = ICodeImpl;
