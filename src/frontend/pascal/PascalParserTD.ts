import {PascalErrorHandler} from './PascalErrorHandler';
import {PascalErrorCode} from './PascalErrorCode';
import {PascalTokenType} from './PascalTokenType';

import {Scanner} from '../Scanner';
import {Parser} from '../Parser';
import {Token} from '../Token';
import {TokenType} from '../TokenType';
import {EofToken} from '../EofToken';

import {MessageType} from '../../message/MessageType';
import {Message} from '../../message/Message';

import {SymTabEntry} from '../../intermediate/SymTabEntry';

import {List} from '../../util/List';

export class PascalParserTD extends Parser {
    protected static errorHandler : PascalErrorHandler = new PascalErrorHandler();

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
        
    }

    /**
     * Return the number of syntax errors found by the parser.
     * @return the error count.
     */
    public getErrorCount() : number {
        return 0;
    }

    /**
     * Synchronize the parser.
     * @param syncSet the set of token types for synchronizing the parser.
     * @return the token where the parser has synchronized.
     * @throws Exception if an error occurred.
     */
    public synchronize(syncSet : List<PascalTokenType>) : Token{
        let token : Token = this.currentToken();

        // If the current token is not in the synchronization set,
        // then it is unexpected and the parser must recover.
        if (!syncSet.contains(token.getType() as PascalTokenType)) {

            // Flag the unexpected token.
            PascalParserTD.errorHandler.flag(token, PascalErrorCode.UNEXPECTED_TOKEN, this);

            // Recover by skipping tokens that are not
            // in the synchronization set.
            do {
                token = this.nextToken();
            } while (!(token instanceof EofToken) &&
                     !syncSet.contains(token.getType() as PascalTokenType));
       }

       return token;
    }
}