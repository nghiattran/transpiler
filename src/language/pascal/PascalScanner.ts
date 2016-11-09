import {Scanner} from '../../frontend/Scanner';
import {Source} from '../../frontend/Source';
import {Token} from '../../frontend/Token';
import {EofToken} from '../../frontend/EofToken';

import {PascalTokenType} from './PascalTokenType';
import {PascalErrorCode} from './PascalErrorCode';

import {PascalWordToken} from './tokens/PascalWordToken';
import {PascalNumberToken} from './tokens/PascalNumberToken';
import {PascalStringToken} from './tokens/PascalStringToken';
import {PascalErrorToken} from './tokens/PascalErrorToken';
import {PascalSpecialSymbolToken} from './tokens/PascalSpecialSymbolToken';

import {Util} from '../../util/Util';

export class PascalScanner extends Scanner {
    /**
     * Constructor
     * @param this.source the this.source to be used with this scanner.
     */
    public constructor(source? : Source) {
        super(source);
    }

    /**
     * Extract and return the next Pascal token from the this.source.
     * @return the next token.
     * @throws Exception if an error occurred.
     */
    protected extractToken() : Token {
        this.skipWhiteSpace();

        let token : Token;
        let currentChar : string = this.currentChar();

        // Construct the next token.  The current character determines the
        // token type.
        if (currentChar === Source.EOF) {
            token = new EofToken(this.source);
        }
        else if (Util.isLetter(currentChar)) {
            token = new PascalWordToken(this.source);
        }
        else if (Util.isDigit(currentChar)) {
            token = new PascalNumberToken(this.source);
        }
        else if (currentChar === '\'') {
            token = new PascalStringToken(this.source);
        }
        else if (PascalTokenType.SPECIAL_SYMBOLS
                 .containsKey(currentChar)) {
            token = new PascalSpecialSymbolToken(this.source);
        }
        else {
            token = new PascalErrorToken(this.source, PascalErrorCode.INVALID_CHARACTER,
                                         currentChar);
            this.nextChar();  // consume character
        }
        
        return token;
    }

    /**
     * Skip whitespace characters by consuming them.  A comment is whitespace.
     * @throws Exception if an error occurred.
     */
    private skipWhiteSpace() : void {
        let currentChar : string = this.currentChar();

        while (currentChar === '\n' || currentChar === ' ' || currentChar === '\t' || (currentChar === '{')) {
            // Start of a comment?
            if (currentChar === '{') {
                do {
                    currentChar = this.nextChar();  // consume comment characters
                } while ((currentChar !== '}') && (currentChar !== Source.EOF));

                // Found closing '}'?
                if (currentChar === '}') {
                    currentChar = this.nextChar();  // consume the '}'
                }
            }

            // Not a comment.
            else {
                currentChar = this.nextChar();  // consume whitespace character
            }
        }
    }
}