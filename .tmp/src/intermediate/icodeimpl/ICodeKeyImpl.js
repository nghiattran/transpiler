"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require('../../util/BaseObject');
var ICodeKeyImpl = (function (_super) {
    __extends(ICodeKeyImpl, _super);
    function ICodeKeyImpl(text) {
        _super.call(this);
        this.text = text;
    }
    ICodeKeyImpl.prototype.toString = function () {
        return this.text.toLowerCase();
    };
    ICodeKeyImpl.LINE = new ICodeKeyImpl('LINE');
    ICodeKeyImpl.ID = new ICodeKeyImpl('ID');
    ICodeKeyImpl.VALUE = new ICodeKeyImpl('VALUE');
    return ICodeKeyImpl;
}(BaseObject_1.BaseObject));
exports.ICodeKeyImpl = ICodeKeyImpl;
//# sourceMappingURL=ICodeKeyImpl.js.map