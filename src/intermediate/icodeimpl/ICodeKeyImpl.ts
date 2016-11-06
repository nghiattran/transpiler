import {ICodeKey} from '../ICodeKey';
import {PolyfillBaseObject} from '../../util/PolyfillBaseObject'; 

export class ICodeKeyImpl extends PolyfillBaseObject implements ICodeKey {
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
