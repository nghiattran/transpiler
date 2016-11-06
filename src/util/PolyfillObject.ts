import {TreeMap} from './TreeMap';

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

export class PolyfillObject {
	private static objectPool : TreeMap<PolyfillObject> = new TreeMap<PolyfillObject>();
    private hashCode : string;
    private static counter : number = 0;

	constructor() {
        this.hashCode = Date.now().toString() + PolyfillObject.counter++;
    	PolyfillObject.objectPool.setAttribute(this.hashCode, this);
    }

    public getHash() : string {
        return this.hashCode;
    }

    public static getObject(key : string) : PolyfillObject {
    	return PolyfillObject.objectPool.getAttribute(key);
    }
}