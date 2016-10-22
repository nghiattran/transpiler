"use strict";
var ICodeImpl_1 = require('./icodeimpl/ICodeImpl');
var ICodeNodeImpl_1 = require('./icodeimpl/ICodeNodeImpl');
var ICodeFactory = (function () {
    function ICodeFactory() {
    }
    /**
     * Create and return an intermediate code implementation.
     * @return the intermediate code implementation.
     */
    ICodeFactory.createICode = function () {
        return new ICodeImpl_1.ICodeImpl();
    };
    /**
     * Create and return a node implementation.
     * @param type the node type.
     * @return the node implementation.
     */
    ICodeFactory.createICodeNode = function (type) {
        return new ICodeNodeImpl_1.ICodeNodeImpl(type);
    };
    return ICodeFactory;
}());
exports.ICodeFactory = ICodeFactory;
