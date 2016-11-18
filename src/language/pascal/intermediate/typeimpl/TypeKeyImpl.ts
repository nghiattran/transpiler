import {TypeKey} from '../../../../intermediate/TypeKey';
import {BaseObject} from '../../../../util/BaseObject';

export class TypeKeyImpl extends BaseObject implements TypeKey {
    private text : string;

    // Enumeration
    public static ENUMERATION_CONSTANTS : TypeKeyImpl = new TypeKeyImpl('ENUMERATION_CONSTANTS');
    
    // Subrange
    public static SUBRANGE_BASE_TYPE : TypeKeyImpl = new TypeKeyImpl('SUBRANGE_BASE_TYPE');
    public static SUBRANGE_MIN_VALUE : TypeKeyImpl = new TypeKeyImpl('SUBRANGE_MIN_VALUE');
    public static SUBRANGE_MAX_VALUE : TypeKeyImpl = new TypeKeyImpl('SUBRANGE_MAX_VALUE');
    
    // Array
    public static ARRAY_INDEX_TYPE : TypeKeyImpl = new TypeKeyImpl('ARRAY_INDEX_TYPE');
    public static ARRAY_ELEMENT_TYPE : TypeKeyImpl = new TypeKeyImpl('ARRAY_ELEMENT_TYPE');
    public static ARRAY_ELEMENT_COUNT : TypeKeyImpl = new TypeKeyImpl('ARRAY_ELEMENT_COUNT');
    
    // Record
    public static RECORD_SYMTAB : TypeKeyImpl = new TypeKeyImpl('RECORD_SYMTAB');


    /**
     * Constructor.
     */
    constructor(text : string) {
        super();
        text = text || this.toString().toLowerCase();
    }

    /**
     * Getter.
     * @return the text of the definition code.
     */
    public getText() : string {
        return this.text;
    }

    public toString() : string {
        return this.toString().toLowerCase();
    }
}