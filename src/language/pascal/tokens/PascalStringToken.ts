import {PascalToken} from '../PascalToken';
import {PascalErrorCode} from '../PascalErrorCode';
import {PascalTokenType} from '../PascalTokenType';

import {Source} from '../../../frontend/Source';

export class PascalStringToken extends PascalToken {
    /**
     * Constructor.
     * @param source the source from where to fetch the token's characters.
     * @throws Exception if an error occurred.
     */
    public constructor(source : Source) {
        super(source);
    }

    /**
     * Extract a Pascal string token from the source.
     * @throws Exception if an error occurred.
     */
    protected extract() : void {
        let textBuffer : string = '';
        let valueBuffer : string = '';

        let currentChar : string = this.nextChar();  // consume initial quote
        textBuffer += '\'';

        // Get string characters.
        do {
            // Replace any whitespace character with a blank.
            if (currentChar === ' ') {
                currentChar = ' ';
            }

            if ((currentChar !== '\'') && (currentChar !== Source.EOF)) {
                textBuffer += currentChar;
                valueBuffer += currentChar;
                currentChar = this.nextChar();  // consume character
            }

            // Quote?  Each pair of adjacent quotes represents a single-quote.
            if (currentChar === '\'') {
                while ((currentChar === '\'') && (this.peekChar() === '\'')) {
                    textBuffer += "''";
                    valueBuffer += currentChar; // append single-quote
                    currentChar = this.nextChar();        // consume pair of quotes
                    currentChar = this.nextChar();
                }
            }
        } while ((currentChar !== '\'') && (currentChar !== Source.EOF));

        if (currentChar === '\'') {
            this.nextChar();  // consume final quote
            textBuffer += '\''

            this.type = PascalTokenType.STRING;
            this.value = valueBuffer;
        }
        else {
            this.type = PascalTokenType.ERROR;
            this.value = PascalErrorCode.UNEXPECTED_EOF;
        }

        this.text = textBuffer.toString();
    }
}
