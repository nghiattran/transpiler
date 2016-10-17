import {TokenType} from "./TokenType";
import {Source} from "./Source"

/**
 * <h1>Token</h1>
 *
 * <p>The framework class that represents a token returned by the scanner.</p>
 *
 * <p>Copyright (c) 2009 by Ronald Mak</p>
 * <p>For instructional purposes only.  No warranties.</p>
 */
export class Token {
    protected type : TokenType;  // language-specific token type
    protected text : string;     // token text
    protected value;    // token value
    protected source : Source;   // source
    protected lineNum : number;     // line number of the token's source line
    protected position : number;    // position of the first token character

    /**
     * Constructor.
     * @param source the source from where to fetch the token's characters.
     * @throws Exception if an error occurred.
     */
    public constructor(source : Source) {
        this.source = source;
        this.lineNum = source.getLineNum();
        this.position = source.getPosition();

        this.extract();
    }

    /**
     * Getter
     * @return the token type
     */
    public getType() : TokenType {
        return this.type;
    }

    /**
     * Getter.
     * @return the token text.
     */
    public getText() : string {
        return this.text;
    }

    /**
     * Getter.
     * @return the token value.
     */
    public getValue() : Object {
        return this.value;
    }

    /**
     * Getter.
     * @return the source line number.
     */
    public getLineNumber() : number {
        return this.lineNum;
    }

    /**
     * Getter.
     * @return the position.
     */
    public getPosition() : number {
        return this.position;
    }

    /**
     * Default method to extract only one-character tokens from the source.
     * Subclasses can override this method to construct language-specific
     * tokens.  After extracting the token, the current source line position
     * will be one beyond the last token character.
     * @throws Exception if an error occurred.
     */
    protected extract() : void {
        this.text = this.currentChar()
        this.value = null;

        this.nextChar();  // consume current character
    }

    /**
     * Call the source's currentChar() method.
     * @return the current character from the source.
     * @throws Exception if an error occurred.
     */
    protected currentChar() : string {
        return this.source.currentChar();
    }

    /**
     * Call the source's nextChar() method.
     * @return the next character from the source after moving forward.
     * @throws Exception if an error occurred.
     */
    protected nextChar() : string {
        return this.source.nextChar();
    }

    /**
     * Call the source's peekChar() method.
     * @return the next character from the source without moving forward.
     * @throws Exception if an error occurred.
     */
    protected peekChar() : string {
        return this.source.peekChar();
    }
}
