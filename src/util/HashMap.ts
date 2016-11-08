import {PolyfillObject} from './PolyfillObject';

export class HashMap <T, E> {
	protected collection : Object = {};

    public getKey(key : T) : string {
        if(key instanceof PolyfillObject) {
            return (<PolyfillObject> key).getHash();
        }
        throw 'Key must be a instance of PolyfillObject or a String.';
    }

	/**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    public setAttribute(key : T, value : E) : void {
        this.put(key, value)
    }

    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    public getAttribute(key : T) : E {
        return this.get(key)
    }

    /**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    public put(key : T, value : E) : void {
        this.collection[this.getKey(key)] = value;
    }

    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    public get(key : T) : E {
        return this.collection[this.getKey(key)];
    }

    /**
     * Set an attribute of the entry.
     * @param key the attribute key of string type.
     * @param value the attribute value.
     */
    public putKeyString(key : string, value : E) : void {
        this.collection[key] = value;
    }

    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    public getKeyString(key : string) : E {
        return this.collection[key];
    }

    public copy(copy: HashMap<PolyfillObject, E>) {
        for (let key in this.getKeys()) {
            copy.putKeyString(key, this.get[key])
        }
    }

    public toList() : E[] {
        let list : any[] = [];

        for (let entry in this.collection) {
            list.push(this.collection[entry]);
        }

        return list;
    }

    public getKeys() : string[] {
        return Object.keys(this.collection);
    }

    public containsKey(key : T) : boolean {
        return this.collection[this.getKey(key)]
    }
}

export class HashSet<T> extends HashMap<T, Object> {
    
}