export class List {
	protected collection : Object[] = [];

	constructor(list? : Object[]) {
		this.collection = list;
	}

	add(value : Object) : void {
		this.collection.push(value)
	}

	remove() : void {
		this.collection.pop()
	}

	indexOf(value : Object) : number {
		return this.collection.indexOf(value);
	}

	contains(value : Object) : boolean {
		return this.collection.indexOf(value) !== -1;
	}

	clone() : List {
		return new List(this.collection);
	}
}