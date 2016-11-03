import {PolyfillBaseObject} from './PolyfillBaseObject';

(new PolyfillBaseObject()).getHash()

export class HashMap <PolyfillBaseObject, E> {
	protected collection : Object = {};

	/**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    public setAttribute(key : PolyfillBaseObject, value : E) : void {
        this.put(key, value)
    }

    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    public getAttribute(key : PolyfillBaseObject) : E {
        return this.get(key)
    }

    /**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    public put(key : PolyfillBaseObject, value : E) : void {
        this.collection[key.getHash()] = value;
    }

    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    public get(key : PolyfillBaseObject) : E {
        return this.collection[key.getHash()];
    }

    public toList() : E[] {
        let list : any[] = [];

        for (var entry in this.collection) {
            list.push(this.collection[entry]);
        }

        return list;
    }
}

export class TreeMap<E> {
    protected collection : Object = {};

    /**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    public setAttribute(key : string, value : E) : void {
        this.put(key, value)
    }

    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    public getAttribute(key : string) : E {
        return this.get(key)
    }

    /**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    public put(key : string, value : E) : void {
        this.collection[key] = value;
    }

    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    public get(key : string) : E {
        return this.collection[key];
    }

    public toList() : E[] {
        let list : any[] = [];

        for (var entry in this.collection) {
            list.push(this.collection[entry]);
        }

        return list;
    }
}

export class HashSet <PolyfillBaseObject> {
    protected collection : Object = {};

    /**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    public setAttribute(key : PolyfillBaseObject, value : Object) : void {
        this.collection[key.getHash()] = value;
    }

    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    public getAttribute(key : PolyfillBaseObject) : Object{
        return this.collection[key.getHash()];
    }

    /**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    public put(key : PolyfillBaseObject, value : Object) : void {
        this.collection[key.getHash()] = value;
    }

    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    public get(key : PolyfillBaseObject) : Object {
        return this.collection[key.getHash()];
    }

    public toList() : Object[] {
        let list : any[] = [];

        for (var entry in this.collection) {
            list.push(this.collection[entry]);
        }

        return list;
    }
}