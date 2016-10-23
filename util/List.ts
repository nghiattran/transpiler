export class List {
	protected collection : Object[] = [];

	constructor(list? : Object[]) {
		this.collection = list || [];
	}

	add(value : Object) : void {
		this.collection.push(value)
	}

	remove(value? : Object) : void {
		if (value) {
			let index : number = this.indexOf(value);
			if (index !== -1)
				this.collection.splice(2, 1);
		} else {
			this.collection.pop()
		}
	}

	indexOf(value : Object) : number {
		return this.collection.indexOf(value);
	}

	index(value : number) : Object {
		return this.collection[value];
	}

	contains(value : Object) : boolean {
		return this.collection.indexOf(value) !== -1;
	}

	addAll(value : List) : void {
		for (var i = 0; i < value.size(); i++) {
			this.add(value.index(i));
		}
	}

	clone() : List {
		// TODO: change it to deep clone
		return new List(this.collection);
	}

	size() {
		return this.collection.length;
	}
}