
export class HashMap {
	protected collection : Object = {};

	/**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    public setAttribute(key : Object, value : Object) : void {
        this.collection[key.toString()] = value;
    }

    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    public getAttribute(key : Object) : Object{
        return this.collection[key.toString()];
    }

    /**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    public put(key : Object, value : Object) : void {
        this.collection[key.toString()] = value;
    }

    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    public get(key : Object) : Object{
        return this.collection[key.toString()];
    }

    public toList() : Object[] {
        let list : any[] = [];

        for (var entry in this.collection) {
            list.push(this.collection[entry]);
        }

        return list;
    }
}