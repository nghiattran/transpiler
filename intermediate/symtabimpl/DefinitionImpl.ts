import {Definition} from '../Definition';

export class DefinitionImpl implements Definition {
    public static ENUM : DefinitionImplEnum;
    private text : string;

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

    public static get(type : DefinitionImplEnum) : DefinitionImpl {
        return new DefinitionImpl(DefinitionImplEnum[type]);
    }
}

export enum DefinitionImplEnum {
    CONSTANT, ENUMERATION_CONSTANT,
    TYPE, VARIABLE, FIELD,
    VALUE_PARM, VAR_PARM,
    PROGRAM_PARM,
    PROGRAM, PROCEDURE, FUNCTION,
    UNDEFINED
}
