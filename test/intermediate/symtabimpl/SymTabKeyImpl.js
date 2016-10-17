"use strict";
var SymTabKeyImpl = (function () {
    /**
     * Constructor.
     */
    function SymTabKeyImpl(text) {
        text = text || this.toString().toLowerCase();
    }
    /**
     * Getter.
     * @return the text of the definition code.
     */
    SymTabKeyImpl.prototype.getText = function () {
        return this.text;
    };
    // Constant.
    SymTabKeyImpl.CONSTANT_VALUE = new SymTabKeyImpl('CONSTANT_VALUE');
    // Procedure or function.
    SymTabKeyImpl.ROUTINE_CODE = new SymTabKeyImpl('ROUTINE_CODE');
    SymTabKeyImpl.ROUTINE_SYMTAB = new SymTabKeyImpl('ROUTINE_SYMTAB');
    SymTabKeyImpl.ROUTINE_ICODE = new SymTabKeyImpl('ROUTINE_ICODE');
    SymTabKeyImpl.ROUTINE_PARMS = new SymTabKeyImpl('ROUTINE_PARMS');
    SymTabKeyImpl.ROUTINE_ROUTINES = new SymTabKeyImpl('ROUTINE_ROUTINES');
    // Variable or record field value.
    SymTabKeyImpl.DATA_VALUE = new SymTabKeyImpl('DATA_VALUE');
    // Local variables array slot numbers.
    SymTabKeyImpl.SLOT = new SymTabKeyImpl('SLOT');
    SymTabKeyImpl.WRAP_SLOT = new SymTabKeyImpl('WRAP_SLOT');
    return SymTabKeyImpl;
}());
exports.SymTabKeyImpl = SymTabKeyImpl;
