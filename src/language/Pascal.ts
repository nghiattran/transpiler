import {PascalScanner} from '../language/pascal/PascalScanner';
import {PascalParserTD} from '../language/pascal/PascalParserTD';

import {Source} from '../frontend/Source';
import {Parser} from '../frontend/Parser';

import {Compiler} from '../Compiler'

export class Pascal extends Compiler {
    constructor () {
        super('Pascal');
        this.scanner = new PascalScanner();
        this.parser =  new PascalParserTD(this.scanner);
    }
}