"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require('../../util/BaseObject');
var SymTabKeyImpl = (function (_super) {
    __extends(SymTabKeyImpl, _super);
    function SymTabKeyImpl(text) {
        _super.call(this);
        text = text || this.toString().toLowerCase();
    }
    SymTabKeyImpl.prototype.getText = function () {
        return this.text;
    };
    SymTabKeyImpl.CONSTANT_VALUE = new SymTabKeyImpl('CONSTANT_VALUE');
    SymTabKeyImpl.ROUTINE_CODE = new SymTabKeyImpl('ROUTINE_CODE');
    SymTabKeyImpl.ROUTINE_SYMTAB = new SymTabKeyImpl('ROUTINE_SYMTAB');
    SymTabKeyImpl.ROUTINE_ICODE = new SymTabKeyImpl('ROUTINE_ICODE');
    SymTabKeyImpl.ROUTINE_PARMS = new SymTabKeyImpl('ROUTINE_PARMS');
    SymTabKeyImpl.ROUTINE_ROUTINES = new SymTabKeyImpl('ROUTINE_ROUTINES');
    SymTabKeyImpl.DATA_VALUE = new SymTabKeyImpl('DATA_VALUE');
    SymTabKeyImpl.SLOT = new SymTabKeyImpl('SLOT');
    SymTabKeyImpl.WRAP_SLOT = new SymTabKeyImpl('WRAP_SLOT');
    return SymTabKeyImpl;
}(BaseObject_1.BaseObject));
exports.SymTabKeyImpl = SymTabKeyImpl;
//# sourceMappingURL=SymTabKeyImpl.js.map