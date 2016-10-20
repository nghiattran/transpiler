import {MessageProducer} from "../message/MessageProducer";
import {Message} from "../message/Message"
import {MessageListener} from "../message/MessageListener";
import {MessageHandler} from "../message/MessageHandler";
import {MessageType} from "../message/MessageType";

import {SymTabStack} from "../intermediate/SymTabStack";
import {SymTabFactory} from "../intermediate/SymTabFactory";

import {Token} from "./Token";
import {Parser} from "./Parser";


/**
 * <h1>Source</h1>
 *
 * <p>The framework class that represents the source program.</p>
 *
 * <p>Copyright (c) 2009 by Ronald Mak</p>
 * <p>For instructional purposes only.  No warranties.</p>
 */
export class Source implements MessageProducer {
    public static EOL = '\n';      // end-of-line character
    public static EOF = 'EOF';  // end-of-file character

    // private BufferedReader reader;            // reader for the source program
    private line : string;                      // source line
    private lineNum : number;                      // current source line number
    private currentPos : number;                   // current source line position

    private messageHandler : MessageHandler;    // delegate to handle messages
    private globalPos : number;
    private text : string;
    /**
     * Constructor.
     * @param reader the reader for the source program
     * @throws IOException if an I/O error occurred
     */
    // public constructor(BufferedReader reader)
    public constructor(text : string) {
        this.text = text;
        this.lineNum = 0;
        this.currentPos = -2;  // set to -2 to read the first source line
        this.messageHandler = new MessageHandler();
        this.globalPos = 0;
    }

    /**
     * Getter.
     * @return the current source line number.
     */
    public getLineNum() : number {
        return this.lineNum;
    }

    /**
     * Getter.
     * @return the position of the next source character in the
     * current source line.
     */
    public getPosition() : number {
        return this.currentPos;
    }

    /**
     * Return the source character at the current position.
     * @return the source character at the current position.
     * @throws Exception if an error occurred.
     */
    public currentChar() : string {
        // First time?
        if (this.currentPos === -2) {
            this.readLine();
            return this.nextChar();
        }


        // At end of file?
        else if (this.line === null) {
            return Source.EOF;
        }

        // At end of line?
        else if ((this.currentPos === -1) || (this.currentPos === this.line.length)) {
            return Source.EOL;
        }

        // Need to read the next line?
        else if (this.currentPos > this.line.length) {
            this.readLine();
            return this.nextChar();
        }

        // Return the character at the current position.
        else {
            return this.line.charAt(this.currentPos);
        }
    }

    /**
     * Consume the current source character and return the next character.
     * @return the next source character.
     * @throws Exception if an error occurred.
     */
    public nextChar() : string {
        ++this.currentPos;
        return this.currentChar();
    }

    /**
     * Return the source character following the current character without
     * consuming the current character.
     * @return the following character.
     * @throws Exception if an error occurred.
     */
    public peekChar() : string {
        this.currentChar();
        if (this.line === null) {
            return Source.EOF;
        }

        let nextPos = this.currentPos + 1;
        return nextPos < this.line.length ? this.line.charAt(nextPos) : Source.EOL;
    }

    /**
     * @return true if at the end of the line, else return false.
     * @throws Exception if an error occurred.
     */
    public atEol() : boolean {
        return (this.line != null) && (this.currentPos === this.line.length);
    }

    /**
     * @return true if at the end of the file, else return false.
     * @throws Exception if an error occurred.
     */
    public atEof() : boolean{
        // First time?
        if (this.currentPos === -2) {
            this.readLine();
        }

        return this.line === null;
    }

    /**
     * Skip the rest of the current input line
     * by forcing the next read to read a new line.
     * @throws Exception if an error occurred.
     */
    public skipToNextLine() : void {
        if (this.line != null) {
            this.currentPos = this.line.length + 1;
        }
    }

    public readALine() : string {
        var line = '';

        if (this.globalPos >= this.text.length) {
            return null;
        }

        while(this.text.charAt(this.globalPos) !== Source.EOL 
            && this.globalPos < this.text.length) 
        {
            line += this.text.charAt(this.globalPos);
            this.globalPos++;
        }
        this.globalPos++;          // skip \n chacracter


        return line;
    }

    /**
     * Read the next source line.
     * @throws IOException if an I/O error occurred.
     */
    private readLine() : void {
        this.line = this.readALine();  // null when at the end of the source
        
        this.currentPos = -1;

        if (this.line != null) {
            ++this.lineNum;
        }

        // Send a source line message containing the line number
        // and the line text to all the listeners.
        if (this.line != null) {
            this.sendMessage(new Message(MessageType.SOURCE_LINE,
                                    [this.lineNum, this.line]));
        }
    }

    /**
     * Close the source.
     * @throws Exception if an error occurred.
     */
    public close() : void {
        // if (this.reader !== null) {
        //     try {
        //         this.reader.close();
        //     }
        //     catch (ex) {
        //         ex.printStackTrace();
        //         throw ex;
        //     }
        // }
    }

    /**
     * Add a parser message listener.
     * @param listener the message listener to add.
     */
    public addMessageListener(listener : MessageListener) : void {
        this.messageHandler.addListener(listener);
    }

    /**
     * Remove a parser message listener.
     * @param listener the message listener to remove.
     */
    public removeMessageListener(listener : MessageListener) : void {
        this.messageHandler.removeListener(listener);
    }

    /**
     * Notify listeners after setting the message.
     * @param message the message to set.
     */
    public sendMessage(message : Message) : void {
        this.messageHandler.sendMessage(message);
    }
}