import {Token} from "./Token";
import {Source} from "./Source";

export class EofToken extends Token {
    /**
     * Constructor.
     * @param source the source from where to fetch subsequent characters.
     * @throws Exception if an error occurred.
     */
    constructor(source: Source) {
        super(source);
    }

    /**
     * Do nothing.  Do not consume any source characters.
     * @param source the source from where to fetch the token's characters.
     * @throws Exception if an error occurred.
     */
    extract () : void {
    }
}
