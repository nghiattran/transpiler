"use strict";
var DefinitionImpl = (function () {
    /**
     * Constructor.
     */
    function DefinitionImpl(text) {
        text = text || this.toString().toLowerCase();
    }
    /**
     * Getter.
     * @return the text of the definition code.
     */
    DefinitionImpl.prototype.getText = function () {
        return this.text;
    };
    DefinitionImpl.CONSTANT = new DefinitionImpl('CONSTANT');
    DefinitionImpl.ENUMERATION_CONSTANT = new DefinitionImpl('ENUMERATION_CONSTANT');
    DefinitionImpl.TYPE = new DefinitionImpl('TYPE');
    DefinitionImpl.VARIABLE = new DefinitionImpl('VARIABLE');
    DefinitionImpl.FIELD = new DefinitionImpl('FIELD');
    DefinitionImpl.VALUE_PARM = new DefinitionImpl('VALUE_PARM');
    DefinitionImpl.VAR_PARM = new DefinitionImpl('VAR_PARM');
    DefinitionImpl.PROGRAM_PARM = new DefinitionImpl('PROGRAM_PARM');
    DefinitionImpl.PROGRAM = new DefinitionImpl('PROGRAM');
    DefinitionImpl.PROCEDURE = new DefinitionImpl('PROCEDURE');
    DefinitionImpl.FUNCTION = new DefinitionImpl('FUNCTION');
    DefinitionImpl.UNDEFINED = new DefinitionImpl('UNDEFINED');
    return DefinitionImpl;
}());
exports.DefinitionImpl = DefinitionImpl;
