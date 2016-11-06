import {ICodeKey} from '../ICodeKey';
import {PolyfillObject} from '../../util/PolyfillObject'; 

export class ICodeKeyImpl extends PolyfillObject implements ICodeKey {
	private text : string;

    public static LINE : ICodeKeyImpl = new ICodeKeyImpl('LINE');
    public static ID : ICodeKeyImpl = new ICodeKeyImpl('ID');
    public static VALUE : ICodeKeyImpl = new ICodeKeyImpl('VALUE');

    public constructor(text : string) {
    	super();
    	this.text = text;
    }

    public toString() {
    	return this.text.toLowerCase();
    }
}
