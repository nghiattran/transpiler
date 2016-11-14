import {SymTabKey} from '../SymTabKey';
import {BaseObject} from '../../util/BaseObject';


export class SymTabKeyImpl extends BaseObject implements SymTabKey {
    private text : string;

    // Constant.
    public static CONSTANT_VALUE : SymTabKeyImpl = new SymTabKeyImpl('CONSTANT_VALUE');

    // Procedure or function.
    public static ROUTINE_CODE : SymTabKeyImpl = new SymTabKeyImpl('ROUTINE_CODE');
    public static ROUTINE_SYMTAB : SymTabKeyImpl = new SymTabKeyImpl('ROUTINE_SYMTAB');
    public static ROUTINE_ICODE : SymTabKeyImpl = new SymTabKeyImpl('ROUTINE_ICODE');
    public static ROUTINE_PARMS : SymTabKeyImpl = new SymTabKeyImpl('ROUTINE_PARMS');
    public static ROUTINE_ROUTINES : SymTabKeyImpl = new SymTabKeyImpl('ROUTINE_ROUTINES');

    // Variable or record field value.
    public static DATA_VALUE : SymTabKeyImpl = new SymTabKeyImpl('DATA_VALUE');

    // Local variables array slot numbers.
    public static SLOT : SymTabKeyImpl = new SymTabKeyImpl('SLOT');
    public static WRAP_SLOT : SymTabKeyImpl = new SymTabKeyImpl('WRAP_SLOT');

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
}
