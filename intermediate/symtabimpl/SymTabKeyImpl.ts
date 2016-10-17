import {SymTabKey} from '../SymTabKey';

export class SymTabKeyImpl implements SymTabKey {
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

    public static get(type : SymTabKeyImplEnum) : SymTabKeyImpl {
        return new SymTabKeyImpl(SymTabKeyImplEnum[type]);
    }
}

export enum SymTabKeyImplEnum {
    // Constant.
    CONSTANT_VALUE,

    // Procedure or function.
    ROUTINE_CODE, ROUTINE_SYMTAB, ROUTINE_ICODE,
    ROUTINE_PARMS, ROUTINE_ROUTINES,

    // Variable or record field value.
    DATA_VALUE,

    // Local variables array slot numbers.
    SLOT, WRAP_SLOT
}
