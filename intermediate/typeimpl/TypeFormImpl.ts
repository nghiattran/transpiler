import {TypeForm} from '../TypeForm';

export class TypeFormImpl implements TypeForm {
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

    public static get(type : TypeFormImplEnum) : TypeFormImpl {
        return new TypeFormImpl(TypeFormImplEnum[type]);
    }

    public toString() : string {
        return this.toString().toLowerCase();
    }
}


export enum TypeFormImplEnum {
    SCALAR, ENUMERATION, SUBRANGE, ARRAY, RECORD
}
