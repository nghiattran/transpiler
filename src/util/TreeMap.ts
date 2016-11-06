export class TreeMap<E> {
    protected collection : Object = {};

    public containsKey(key : string) : boolean {
        return this.collection[key] !== undefined;
    }

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