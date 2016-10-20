import {Scanner} from '../Scanner';
import {Parser} from '../Parser';
import {Token} from '../Token';
import {EofToken} from '../EofToken';

import {MessageType} from '../../message/MessageType';
import {Message} from '../../message/Message';

export class PascalParserTD extends Parser {
    /**
     * Constructor.
     * @param scanner the scanner to be used with this parser.
     */
    public constructor(scanner : Scanner) {
        super(scanner);
    }

    /**
     * Parse a Pascal source program and generate the symbol table
     * and the intermediate code.
     */
    public parse() : void {
        let token : Token;
        // let startTime : number = performance.now();

        while (!((token = this.nextToken()) instanceof EofToken)) {}

        // Send the parser summary message.
        // let elapsedTime : number = performance.now() - startTime;
        let elapsedTime = 0;
        this.sendMessage(new Message(MessageType.PARSER_SUMMARY,
                                [token.getLineNumber(),
                                  this.getErrorCount(),
                                  elapsedTime]));
    }

    /**
     * Return the number of syntax errors found by the parser.
     * @return the error count.
     */
    public getErrorCount() : number {
        return 0;
    }
}