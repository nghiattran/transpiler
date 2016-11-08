import {PascalToken} from '../PascalToken';
import {PascalErrorCode} from '../PascalErrorCode';
import {PascalTokenType} from '../PascalTokenType';

import {Source} from '../../../frontend/Source';

export class PascalSpecialSymbolToken extends PascalToken {
    /**
     * Constructor.
     * @param source the source from where to fetch the token's characters.
     * @throws Exception if an error occurred.
     */
    public constructor(source : Source) {
        super(source);
    }

    /**
     * Extract a Pascal special symbol token from the source.
     * @throws Exception if an error occurred.
     */
    protected extract() : void {
        let currentChar : string = this.currentChar();

        this.text = currentChar;
        this.type = undefined;

        switch (currentChar) {

            // Single-character special symbols.
            case '+':  case '-':  case '*':  case '/':  case ',':
            case ';':  case '\'': case '=':  case '(':  case ')':
            case '[':  case ']':  case '{':  case '}':  case '^': {
                this.nextChar();  // consume character
                break;
            }

            // : or :=
            case ':': {
                currentChar = this.nextChar();  // consume ':';

                if (currentChar === '=') {
                    this.text += currentChar;
                    this.nextChar();  // consume '='
                }

                break;
            }

            // < or <= or <>
            case '<': {
                currentChar = this.nextChar();  // consume '<';

                if (currentChar === '=') {
                    this.text += currentChar;
                    this.nextChar();  // consume '='
                }
                else if (currentChar === '>') {
                    this.text += currentChar;
                    this.nextChar();  // consume '>'
                }

                break;
            }

            // > or >=
            case '>': {
                currentChar = this.nextChar();  // consume '>';

                if (currentChar === '=') {
                    this.text += currentChar;
                    this.nextChar();  // consume '='
                }

                break;
            }

            // . or ..
            case '.': {
                currentChar = this.nextChar();  // consume '.';

                if (currentChar === '.') {
                    this.text += currentChar;
                    this.nextChar();  // consume '.'
                }

                break;
            }

            default: {
                this.nextChar();  // consume bad character
                this.type = PascalTokenType.ERROR;
                this.value = PascalErrorCode.INVALID_CHARACTER;
            }
        }

        // Set the type if it wasn't an error.
        if (this.type === undefined) {
            this.type = PascalTokenType.SPECIAL_SYMBOLS.get(this.text);
        }
    }
}
