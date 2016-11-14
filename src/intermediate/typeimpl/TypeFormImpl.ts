import {TypeForm} from '../TypeForm';
import {BaseObject} from '../../util/BaseObject';

export class TypeFormImpl extends BaseObject implements TypeForm {
    private text : string;

    public static SCALAR : TypeFormImpl = new TypeFormImpl('SCALAR');
    public static ENUMERATION : TypeFormImpl = new TypeFormImpl('ENUMERATION');
    public static SUBRANGE : TypeFormImpl = new TypeFormImpl('SUBRANGE');
    public static ARRAY : TypeFormImpl = new TypeFormImpl('ARRAY');
    public static RECORD : TypeFormImpl = new TypeFormImpl('RECORD');
    
    /**
     * Constructor.
     */
    constructor(text : string) {
        super();
        this.text = text || this.toString().toLowerCase();
    }

    /**
     * Getter.
     * @return the text of the definition code.
     */
    public getText() : string {
        return this.text;
    }

    public toString() : string {
        return this.getText().toLowerCase();
    }
}