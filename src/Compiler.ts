import {Source} from './frontend/Source';
import {Parser} from './frontend/Parser';
import {Scanner} from './frontend/Scanner';

export abstract class Compiler {
	protected source : Source;
	protected parser : Parser;
	protected scanner : Scanner;

	constructor(public readonly languageName : string) {

	}

	setSource(source : Source) : void {
		this.source = source;
		this.scanner.setSource(this.source);
	}

	getParser() {
        return this.parser;
    }
}