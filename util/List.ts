export class List {
	protected collection : Object[] = [];

	add(value : Object) : void {
		this.collection.push(value)
	}

	remove() : void {
		this.collection.pop()
	}
}