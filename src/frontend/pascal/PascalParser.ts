import {PascalErrorCode} from './PascalErrorCode';
import {ProgramParser} from './parsersBundle';

import {PascalParserTD} from './PascalParserTD';

import {Scanner} from '../Scanner';
import {Parser} from '../Parser';
import {Token} from '../Token';
import {TokenType} from '../TokenType';
import {EofToken} from '../EofToken';

import {MessageType} from '../../message/MessageType';
import {Message} from '../../message/Message';

import {SymTabEntry} from '../../intermediate/SymTabEntry';

import {List} from '../../util/List';

export class PascalParser extends PascalParserTD {
    /**
     * Constructor.
     * @param scanner the scanner to be used with this parser.
     */
    public constructor(param : any) {
        if (param instanceof PascalParserTD) {
            super(param.getScanner());
        } else {
            super(param);
        }
    }

    /**
     * Parse a Pascal source program and generate the symbol table
     * and the intermediate code.
     */
    public parse(...params) : any {
        let token : Token;
        // let startTime : number = performance.now();

        try {
            let token : Token = this.nextToken();

            // Parse a program.
            let programParser : ProgramParser = new ProgramParser(this);
            programParser.parse(token, null);
            token = this.currentToken();

            // Send the parser summary message.
            // float elapsedTime = (System.currentTimeMillis() - startTime)/1000f;
            let elapsedTime = 0;
            this.sendMessage(new Message(MessageType.PARSER_SUMMARY,
                                [token.getLineNumber(),
                                  this.getErrorCount(),
                                  elapsedTime]));
        }
        catch (ex) {
            console.log('Error!!!!!!!!');
            console.log(ex);
            PascalParser.errorHandler.abortTranslation(PascalErrorCode.IO_ERROR, this);
        }
    }
}