import {Token} from '../Token';
import {Parser} from '../Parser';

import {PascalErrorCode} from './PascalErrorCode';

import {MessageType} from '../../message/MessageType';
import {Message} from '../../message/Message';

export class PascalErrorHandler {
    private static MAX_ERRORS : number = 25;
    private static errorCount : number = 0;   // count of syntax errors

    /**
     * Getter.
     * @return the syntax error count.
     */
    public getErrorCount() : number {
        return PascalErrorHandler.errorCount;
    }

    /**
     * Flag an error in the source line.
     * @param token the bad token.
     * @param errorCode the error code.
     * @param parser the parser.
     * @return the flagger string.
     */
    public flag(token : Token, errorCode : PascalErrorCode, parser : Parser) : void{
        // Notify the parser's listeners.
        parser.sendMessage(new Message(MessageType.SYNTAX_ERROR,
                            [token.getLineNumber(),
                            token.getPosition(),
                            token.getText(),
                            errorCode.toString()]));

        if (++PascalErrorHandler.errorCount > PascalErrorHandler.MAX_ERRORS) {
            this.abortTranslation(PascalErrorCode.TOO_MANY_ERRORS, parser);
        }
    }

    /**
     * Abort the translation.
     * @param errorCode the error code.
     * @param parser the parser.
     */
    public abortTranslation(errorCode : PascalErrorCode, parser : Parser) : void {
        // Notify the parser's listeners and then abort.
        let fatalText : string = "FATAL ERROR: " + errorCode.toString();
        parser.sendMessage(new Message(MessageType.SYNTAX_ERROR,
                                [0,
                                 0,
                                 "",
                                 fatalText]));
        // System.exit(errorCode.getStatus());
    }
}
