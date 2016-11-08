import {Token} from '../../frontend/Token';
import {Source} from '../../frontend/Source';

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
