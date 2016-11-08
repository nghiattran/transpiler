import {Source} from '../../../frontend/Source';

import {PascalToken} from '../PascalToken';
import {PascalScanner} from '../PascalScanner';
import {PascalTokenType} from '../PascalTokenType';

import {Util} from '../../../util/Util';

export class PascalWordToken extends PascalToken {
    /**
     * Constructor.
     * @param source the source from where to fetch the token's characters.
     * @throws Exception if an error occurred.
     */
    public constructor(source : Source) {
        super(source);
    }

    /**
     * Extract a Pascal word token from the source.
     * @throws Exception if an error occurred.
     */
    protected extract() : void {
        let textBuffer : string = '';
        let currentChar : string = this.currentChar();

        // Get the word characters (letter or digit).  The scanner has
        // already determined that the first character is a letter.
        while (Util.isLetterOrDigit(currentChar)) {
            textBuffer += currentChar;
            currentChar = this.nextChar();  // consume character
        }

        this.text = textBuffer.toString();

        // Is it a reserved word or an identifier?
        if (PascalTokenType.RESERVED_WORDS.indexOf(PascalTokenType[this.text.toUpperCase()]) !== -1) {
            this.type = PascalTokenType[this.text.toUpperCase()]
        } else {
            this.type = PascalTokenType.IDENTIFIER;
        }
    }
}
