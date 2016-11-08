import {PascalErrorCode} from './PascalErrorCode';
import {PascalParser} from './PascalParser';
import {ProgramParser} from './parsersBundle';

import {Scanner} from '../../frontend/Scanner';
import {Parser} from '../../frontend/Parser';
import {Token} from '../../frontend/Token';
import {TokenType} from '../../frontend/TokenType';
import {EofToken} from '../../frontend/EofToken';

import {MessageType} from '../../message/MessageType';
import {Message} from '../../message/Message';

import {SymTabEntry} from '../../intermediate/SymTabEntry';
import {Predefined} from '../../intermediate/symtabimpl/Predefined';

import {List} from '../../util/List';

export class PascalParserTD extends PascalParser {
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
        Predefined.initialize(PascalParserTD.symTabStack);

        try {
            let token : Token = this.nextToken();

            // Parse a program.
            let programParser : ProgramParser = new ProgramParser(this);
            programParser.parse(token, undefined);
            
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
            console.error('Error!!!!!!!!');
            console.info(ex);
            PascalParserTD.errorHandler.abortTranslation(PascalErrorCode.IO_ERROR, this);
        }
    }
}