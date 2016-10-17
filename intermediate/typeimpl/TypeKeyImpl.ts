import {TypeKey} from '../TypeKey';

export class TypeKeyImpl implements TypeKey {
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

    public static get(type : TypeKeyImplEnum) : TypeKeyImpl {
        return new TypeKeyImpl(TypeKeyImplEnum[type]);
    }

    public toString() : string {
        return this.toString().toLowerCase();
    }
}

export enum TypeKeyImplEnum {
    // Enumeration
    ENUMERATION_CONSTANTS,

    // Subrange
    SUBRANGE_BASE_TYPE, SUBRANGE_MIN_VALUE, SUBRANGE_MAX_VALUE,

    // Array
    ARRAY_INDEX_TYPE, ARRAY_ELEMENT_TYPE, ARRAY_ELEMENT_COUNT,

    // Record
    RECORD_SYMTAB
}
