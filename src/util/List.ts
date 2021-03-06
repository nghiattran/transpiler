export class List <T>{
	protected collection : T[] = [];

	constructor(list? : T[]) {
		this.collection = list || [];
	}

	add(value : T) : void {
		if (!this.contains(value)) {
			this.collection.push(value)
		}
	}

	removeIndex(index : number) : void {
		this.remove(this.get(index));
	}

	remove(value? : T) : void {
		if (value) {
			let index : number = this.indexOf(value);
			if (index !== -1)
				this.collection.splice(index, 1);
		} else {
			this.collection.pop()
		}
	}

	get(value : number) : T {
		return this.index(value);
	}

	indexOf(value : T) : number {
		return this.collection.indexOf(value);
	}

	index(value : number) : T {
		return this.collection[value];
	}

	contains(value : T) : boolean {
		return this.indexOf(value) !== -1;
	}

	addAll(value : List<T>) : void {
		for (let i = 0; i < value.size(); i++) {
			if (!this.contains(value[i])) {
				this.add(value.index(i));
			}
		}
	}

	clone() : List<T> {
		return new List(this.collection.slice(0));
		// return new List(this.collection);
	}

	size() {
		return this.collection.length;
	}
}