
export class HashMap {
	protected collection : Object;

	/**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    public setAttribute(key, value) : void {
        this.collection[key.toString()] = value;
    }

    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    public getAttribute(key) : Object{
        return this.collection[key.toString()];
    }

    /**
     * Set an attribute of the entry.
     * @param key the attribute key.
     * @param value the attribute value.
     */
    public put(key, value) : void {
        this.collection[key.toString()] = value;
    }

    /**
     * Get the value of an attribute of the entry.
     * @param key the attribute key.
     * @return the attribute value.
     */
    public get(key) : Object{
        return this.collection[key.toString()];
    }
}