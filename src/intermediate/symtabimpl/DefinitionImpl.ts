import {Definition} from '../Definition';

export class DefinitionImpl implements Definition {
    private text : string;

    public static CONSTANT : DefinitionImpl = new DefinitionImpl('CONSTANT');
    public static ENUMERATION_CONSTANT : DefinitionImpl = new DefinitionImpl('ENUMERATION_CONSTANT');
    public static TYPE : DefinitionImpl = new DefinitionImpl('TYPE');
    public static VARIABLE : DefinitionImpl = new DefinitionImpl('VARIABLE');
    public static FIELD : DefinitionImpl = new DefinitionImpl('FIELD');
    public static VALUE_PARM : DefinitionImpl = new DefinitionImpl('VALUE_PARM');
    public static VAR_PARM : DefinitionImpl = new DefinitionImpl('VAR_PARM');
    public static PROGRAM_PARM : DefinitionImpl = new DefinitionImpl('PROGRAM_PARM');
    public static PROGRAM : DefinitionImpl = new DefinitionImpl('PROGRAM');
    public static PROCEDURE : DefinitionImpl = new DefinitionImpl('PROCEDURE');
    public static FUNCTION : DefinitionImpl = new DefinitionImpl('FUNCTION');
    public static UNDEFINED : DefinitionImpl = new DefinitionImpl('UNDEFINED');

    /**
     * Constructor.
     */
    constructor(text : string) {
        text = text || this.toString().toLowerCase();
    }

    /**
     * Getter.
     * @return the text of the definition code.
     */
    public getText() : string {
        return this.text;
    }
}