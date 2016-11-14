import {TreeMap} from './TreeMap';

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

export class BaseObject {
	private static objectPool : TreeMap<BaseObject> = new TreeMap<BaseObject>();
    private hashCode : string;
    private static counter : number = 0;

	constructor() {
        this.hashCode = Date.now().toString() + BaseObject.counter++;
    	BaseObject.objectPool.setAttribute(this.hashCode, this);
    }

    public getHash() : string {
        return this.hashCode;
    }

    public static getObject(key : string) : BaseObject {
    	return BaseObject.objectPool.getAttribute(key);
    }
}