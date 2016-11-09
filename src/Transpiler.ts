import {Parser} from './frontend/Parser';
import {Source} from './frontend/Source';

import {MessageListener} from './message/MessageListener';
import {Message} from './message/Message';
import {MessageType} from './message/MessageType';

import {ICode} from './intermediate/ICode';
import {SymTabStack} from './intermediate/SymTabStack';
import {SymTabEntry} from './intermediate/SymTabEntry';
import {SymTabKeyImpl} from './intermediate/symtabimpl/SymTabKeyImpl';

import {CrossReferencer} from './util/CrossReferencer';
import {IntermediateHandler} from './util/IntermediateHandler';

import {Exporter} from './util/export/Exporter';

import {List} from './util/List';

import {Compiler} from './Compiler';

let util = require('util');

export class Transpiler {
    private parser : Parser;            // language-independent parser
    private source : Source;            // language-independent scanner
    private iCode : ICode;              // generated intermediate code
    private symTabStack : SymTabStack;  // symbol table stack

    public constructor (private language : Compiler) {

    }

    public setCompiler(language : Compiler) {
        this.language = language;
    }

    /**
     * Compile or interpret a Transpiler source program.
     * @param operation either 'compile' or 'execute'.
     * @param text source file content.
     * @param intermediateHandlers.
     */
    public parse (
        text : string,
        intermediateHandlers? : IntermediateHandler[]) : void
    {
        try {
            this.source = new Source(text);
            this.source.addMessageListener(new SourceMessageListener());

            this.language.setSource(this.source);

            this.parser = this.language.getParser();
            this.parser.addMessageListener(new ParserMessageListener());

            this.parser.parse();
            this.source.close();

            if (this.parser.getErrorCount() === 0) {
                this.symTabStack = this.parser.getSymTabStack();
                
                let programId : SymTabEntry = this.symTabStack.getProgramId();
                this.iCode = programId.getAttribute(SymTabKeyImpl.ROUTINE_ICODE) as ICode;
            }
        } catch (ex) {
            console.info(ex)
            console.info('***** Internal translator error. *****');
            // ex.printStackTrace();
        }
    }

    public export(exporter : Exporter) : any {
        if(this.symTabStack === undefined) {
            throw 'Nothing to parse yet.';
        }

        return exporter.export(this.symTabStack);
    }

    private static FLAGS : string = '[-ixlafcr]';
    private USAGE : string = 'Usage: {{language}} execute|compile '.replace('{{language}}', this.language.languageName) 
        + Transpiler.FLAGS + ' <source file path>';

    public static SOURCE_LINE_FORMAT : string = '%d %s';

    public static PARSER_SUMMARY_FORMAT : string =
        '\n%d source lines.' +
        '\n%d syntax errors.' +
        '\n%d seconds total parsing time.\n';

    public static PREFIX_WIDTH : number = 5;

    public static INTERPRETER_SUMMARY_FORMAT : string =
        '\n%,20d statements executed.' +
        '\n%,20d runtime errors.' +
        '\n%,20.2f seconds total execution time.\n';

    public static COMPILER_SUMMARY_FORMAT : string =
        '\n%,20d instructions generated.' +
        '\n%,20.2f seconds total code generation time.\n';

    public static LINE_FORMAT : string =
        '>>> AT LINE %03d\n';

    public static ASSIGN_FORMAT : string =
        '>>> AT LINE %03d: %s = %s\n';

    public static FETCH_FORMAT : string =
        '>>> AT LINE %03d: %s : %s\n';

    public static CALL_FORMAT : string =
        '>>> AT LINE %03d: CALL %s\n';

    public static RETURN_FORMAT : string =
        '>>> AT LINE %03d: RETURN FROM %s\n';
}

/**
 * Listener for source messages.
 */
class SourceMessageListener implements MessageListener {
    private sourcelineReport : string = '';

    /**
     * Called by the source whenever it produces a message.
     * @param message the message.
     */
    public messageReceived(message : Message) : void{
        let type : MessageType = message.getType();
        let body : Object[] = message.getBody() as Object[];
        switch (type) {

            case MessageType.SOURCE_LINE: {
                let lineNumber : number = body[0] as number;
                let lineText : string  = body[1] as string;
                
                this.sourcelineReport += util.format(Transpiler.SOURCE_LINE_FORMAT,
                                        lineNumber, lineText)
                break;
            }
        }
    }
}

/**
 * Listener for parser messages.
 */
class ParserMessageListener implements MessageListener {
    private parserSummary : ParserSummary;
    private syntaxError : List<SyntacError> = new List<SyntacError>();

    /**
     * Called by the parser whenever it produces a message.
     * @param message the message.
     */
    public messageReceived(message : Message) : void{
        let type : MessageType = message.getType();

        switch (type) {
            case MessageType.PARSER_SUMMARY: {
                let body : number[] = message.getBody() as number[];
                let statementCount : number = body[0] as number;
                let syntaxErrors : number = body[1] as number;
                let elapsedTime : number = body[2] as number;

                this.parserSummary = new ParserSummary(statementCount,
                                        syntaxErrors, elapsedTime);

                break;
            }

            case MessageType.SYNTAX_ERROR: {
                let body : Object[] = message.getBody() as Object[];
                let lineNumber : number = body[0] as number;
                let position : number = body[1] as number;
                let tokenText : string = body[2] as string;
                let errorMessage : string = body[3] as string;

                this.syntaxError.add(
                    new SyntacError(lineNumber, position, tokenText, errorMessage)
                );

                break;
            }
        }
    }
}

class SyntacError {
    constructor(
        public lineNumber : number, 
        public position : number, 
        public tokenText : string, 
        public errorMessage : string) 
    {

    }

    toJson() : Object {
        return {
            lineNumber : this.lineNumber,
            position : this.position,
            tokenText : this.tokenText,
            errorMessage : this.errorMessage
        }
    }

    toString() : string {
        let spaceCount : number = Transpiler.PREFIX_WIDTH + this.position;
        let flagBuffer : string = '';

        // Spaces up to the error position.
        for (let i = 0; i < spaceCount; i++) {
            flagBuffer += ' ';
        }

        // A pointer to the error followed by the error message.
        flagBuffer +=  '^\n*** ' + this.errorMessage;

        // Text, if any, of the bad token.
        if (this.tokenText !== undefined) {
            flagBuffer += ' [at \'' + this.tokenText
                + '\']';
        }

        return flagBuffer;
    }
}

class ParserSummary {
    constructor(
        public statementCount : number, 
        public syntaxErrors : number, 
        public elapsedTime : number) 
    {

    }

    toJson() : Object {
        return {
            statementCount : this.statementCount,
            syntaxErrors : this.syntaxErrors,
            elapsedTime : this.elapsedTime
        }
    }

    toString() : string {
        return util.format(Transpiler.PARSER_SUMMARY_FORMAT,
                          this.statementCount, this.syntaxErrors,
                          this.elapsedTime);
    }
}
