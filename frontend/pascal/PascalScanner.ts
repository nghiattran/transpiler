import {Scanner} from '../Scanner';
import {Source} from '../Source';
import {Token} from '../Token';
import {EofToken} from '../EofToken';

export class PascalScanner extends Scanner {
    /**
     * Constructor
     * @param source the source to be used with this scanner.
     */
    public constructor(source : Source) {
        super(source);
    }

    /**
     * Extract and return the next Pascal token from the source.
     * @return the next token.
     * @throws Exception if an error occurred.
     */
    protected extractToken() : Token {
        let token : Token;
        let currentChar : string = this.currentChar();

        // Construct the next token.  The current character determines the
        // token type.
        if (currentChar == Source.EOF) {
            token = new EofToken(this.source);
        }
        else {
            token = new Token(this.source);
        }

        return token;
    }
}