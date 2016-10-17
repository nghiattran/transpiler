import {MessageProducer} from "../message/MessageProducer";
import {Message} from "../message/Message"
import {MessageListener} from "../message/MessageListener";
import {MessageHandler} from "../message/MessageHandler";

import {SymTabStack} from "../intermediate/SymTabStack";
import {SymTabFactory} from "../intermediate/SymTabFactory";

import {Token} from "./Token";
import {Parser} from "./Parser";
import {Source} from "./Source";

export abstract class Scanner {
    protected source : Source;     // source
    private currentToken : Token;  // current token

    /**
     * Constructor
     * @param source the source to be used with this scanner.
     */
    public Constructor(source : Source) {
        this.source = source;
    }

    /**
     * @return the current token.
     */
    public getCurrentToken() : Token {
        return this.currentToken;
    }

    /**
     * Return next token from the source.
     * @return the next token.
     * @throws Exception if an error occurred.
     */
    public nextToken() : Token{
        this.currentToken = this.extractToken();
        return this.currentToken;
    }

    /**
     * Do the actual work of extracting and returning the next token from the
     * source. Implemented by scanner subclasses.
     * @return the next token.
     * @throws Exception if an error occurred.
     */
    protected abstract extractToken() : Token;

    /**
     * Call the source's currentChar() method.
     * @return the current character from the source.
     * @throws Exception if an error occurred.
     */
    public currentChar() : string{
        return this.source.currentChar();
    }

    /**
     * Call the source's nextChar() method.
     * @return the next character from the source.
     * @throws Exception if an error occurred.
     */
    public nextChar() : string {
        return this.source.nextChar();
    }

    /**
     * Call the source's atEol() method.
     * @return true if at the end of the source line, else return false.
     * @throws Exception if an error occurred.
     */
    public atEol() : boolean {
        return this.source.atEol();
    }

    /**
     * Call the source's atEof() method.
     * @return true if at the end of the source file, else return false.
     * @throws Exception if an error occurred.
     */
    public atEof() : boolean{
        return this.source.atEof();
    }

    /**
     * Call the source's skipToNextLine() method.
     * @throws Exception if an error occurred.
     */
    public skipToNextLine() : void {
        this.source.skipToNextLine();
    }
}
