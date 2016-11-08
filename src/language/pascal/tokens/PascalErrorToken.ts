import {PascalToken} from '../PascalToken';
import {PascalErrorCode} from '../PascalErrorCode';
import {PascalTokenType} from '../PascalTokenType';

import {Source} from '../../../frontend/Source';

export class PascalErrorToken extends PascalToken {
    /**
     * Constructor.
     * @param source the source from where to fetch subsequent characters.
     * @param errorCode the error code.
     * @param tokenText the text of the erroneous token.
     * @throws Exception if an error occurred.
     */
    public constructor(source : Source, errorCode : PascalErrorCode,
                            tokenText : string)
    {
        super(source);

        this.text = tokenText;
        this.type = PascalTokenType.ERROR;
        this.value = errorCode;
    }

    /**
     * Do nothing.  Do not consume any source characters.
     * @throws Exception if an error occurred.
     */
    protected extract() : void{
    }
}
