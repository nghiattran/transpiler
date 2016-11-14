"use strict";
var ICodeImpl_1 = require('./icodeimpl/ICodeImpl');
var ICodeNodeImpl_1 = require('./icodeimpl/ICodeNodeImpl');
var ICodeFactory = (function () {
    function ICodeFactory() {
    }
    ICodeFactory.createICode = function () {
        return new ICodeImpl_1.ICodeImpl();
    };
    ICodeFactory.createICodeNode = function (type) {
        return new ICodeNodeImpl_1.ICodeNodeImpl(type);
    };
    return ICodeFactory;
}());
exports.ICodeFactory = ICodeFactory;
//# sourceMappingURL=ICodeFactory.js.map