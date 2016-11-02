import {Token} from '../Token';
import {Source} from '../Source';

export class PascalToken extends Token {
    /**
     * Constructor.
     * @param source the source from where to fetch the token's characters.
     * @throws Exception if an error occurred.
     */
    constructor(source : Source) {
        super(source);
    }
}
