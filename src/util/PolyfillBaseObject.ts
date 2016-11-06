import {TreeMap} from './HashMap';

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

export class PolyfillBaseObject {
	private static objectPool : TreeMap<PolyfillBaseObject> = new TreeMap<PolyfillBaseObject>();
    private hashCode : string;
    private static counter : number = 0;

	constructor() {
        this.hashCode = Date.now().toString() + PolyfillBaseObject.counter++;
    	PolyfillBaseObject.objectPool.setAttribute(this.hashCode, this);
    }

    public getHash() : string {
        return this.hashCode;
    }

    public static getObject(key : string) : PolyfillBaseObject {
    	return PolyfillBaseObject.objectPool.getAttribute(key);
    }
}