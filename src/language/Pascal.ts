import {Parser} from '../frontend/Parser';
import {Source} from '../frontend/Source';
import {FrontendFactory} from '../frontend/FrontendFactory';

import {MessageListener} from '../message/MessageListener';
import {Message} from '../message/Message';
import {MessageType} from '../message/MessageType';

import {ICode} from '../intermediate/ICode';
import {SymTabStack} from '../intermediate/SymTabStack';
import {SymTabEntry} from '../intermediate/SymTabEntry';
import {SymTabKeyImpl} from '../intermediate/symtabimpl/SymTabKeyImpl';

import {CrossReferencer} from '../util/CrossReferencer';
import {ParseTreePrinter} from '../util/ParseTreePrinter';

export class Pascal {
    private parser : Parser;            // language-independent parser
    private source : Source;            // language-independent scanner
    private iCode : ICode;              // generated intermediate code
    private symTabStack : SymTabStack;  // symbol table stack
//    private Backend backend;          // backend

    public intermediate : boolean;     // true to print intermediate code
    public xref : boolean;             // true to print cross-reference listing
    public lines : boolean;            // true to print source line tracing
    public assign : boolean;           // true to print value assignment tracing
    public fetch : boolean;            // true to print value fetch tracing
    public call : boolean;             // true to print routine call tracing
    public returnn : boolean;          // true to print routine return tracing



    /**
     * Compile or interpret a Pascal source program.
     * @param operation either 'compile' or 'execute'.
     * @param filePath the source file path.
     * @param flags the command line flags.
     */
    public constructor(operation : string, text : string, flags : string) {
        try {
            this.intermediate = flags.indexOf('i') > -1;
            this.xref         = flags.indexOf('x') > -1;
            this.lines        = flags.indexOf('l') > -1;
            this.assign       = flags.indexOf('a') > -1;
            this.fetch        = flags.indexOf('f') > -1;
            this.call         = flags.indexOf('c') > -1;
            this.returnn      = flags.indexOf('r') > -1;

            this.source = new Source(text);
            this.source.addMessageListener(new SourceMessageListener());
            
            this.parser = FrontendFactory.createParser('Pascal', 'top-down', this.source);
            this.parser.addMessageListener(new ParserMessageListener());
            
            this.parser.parse();
            this.source.close();
            

            if (this.parser.getErrorCount() === 0) {
                this.symTabStack = this.parser.getSymTabStack();
                
                let programId : SymTabEntry = this.symTabStack.getProgramId();
                this.iCode = programId.getAttribute(SymTabKeyImpl.ROUTINE_ICODE) as ICode;
                
                if (this.xref) {
                    let crossReferencer : CrossReferencer = new CrossReferencer();
                    crossReferencer.print(this.symTabStack);
                }

                if (this.intermediate) {
                    let treePrinter : ParseTreePrinter =
                                         new ParseTreePrinter();
                    treePrinter.print(this.symTabStack);
                }

               // backend.process(iCode, symTabStack);
            }
        } catch (ex) {
            console.info(ex)
            console.info('***** Internal translator error. *****');
            ex.printStackTrace();
        }
    }

    private static FLAGS : string = '[-ixlafcr]';
    private static USAGE : string =
        'Usage: Pascal execute|compile ' + Pascal.FLAGS + ' <source file path>';

    /**
     * The main method.
     * @param args command-line arguments: 'compile' or 'execute' followed by
     *             optional flags followed by the source file path.
     */
    public static main(args : string []) : void {
        try {
            let operation : string = args[0];

            // Operation.
            if (!(operation.toLowerCase() === 'compile'
                  || operation.toLowerCase() === 'execute')) {
                throw new Error();
            }

            let i : number = 0;
            let flags : string = '';

            // Flags.
            flags = args[1];

            // Source path.
            if (i < args.length) {
                let path : string = args[2];
                new Pascal(operation, path, flags);
            }
            else {
                throw new Error();
            }
        }
        catch (ex) {
            console.info(this.USAGE);
        }
    }

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
 * Listener for back end messages.
 */
class BackendMessageListener implements MessageListener {
    constructor(private parent: Pascal) {

    }

    /**
     * Called by the back end whenever it produces a message.
     * @param message the message.
     */
    public messageReceived(message : Message) : void {
        let type : MessageType = message.getType();

        switch (type) {
            case MessageType.SOURCE_LINE: {
                if (this.parent.lines) {
                    let lineNumber : number = message.getBody() as number;

                    console.info(Pascal.LINE_FORMAT, lineNumber);
                }
                break;
            }

            case MessageType.ASSIGN: {
                if (this.parent.assign) {
                    let body : Object[] = message.getBody() as Object[];
                    let lineNumber : number = body[0] as number;
                    let letiableName : string = body[1] as string;
                    let value : Object = body[2] as Object;

                    console.info(Pascal.ASSIGN_FORMAT,
                                      lineNumber, letiableName, value);
                }
                break;
            }

            case MessageType.FETCH: {
                if (this.parent.fetch) {
                    let body : Object[] = message.getBody() as Object[];
                    let lineNumber : number = body[0] as number;
                    let letiableName : string = body[1] as string;
                    let value : Object = body[2] as Object;

                    console.info(Pascal.FETCH_FORMAT,
                                      lineNumber, letiableName, value);
                }
                break;
            }

            case MessageType.CALL: {
                if (this.parent.call) {
                    let body : Object[] = message.getBody() as Object[];
                    let lineNumber : number = body[0] as number;
                    let routineName : string = body[1] as string;

                    console.info(Pascal.CALL_FORMAT,
                                      lineNumber, routineName);
                }
                break;
            }

            case MessageType.RETURN: {
                if (this.parent.returnn) {
                    let body : Object[] = message.getBody() as Object[];
                    let lineNumber : number = body[0] as number;
                    let routineName : string = body[1] as string;

                    console.info(Pascal.RETURN_FORMAT,
                                      lineNumber, routineName);
                }
                break;
            }

            case MessageType.RUNTIME_ERROR: {
                let body : Object[] = message.getBody() as Object[];
                let lineNumber : number = body[0] as number;
                let errorMessage : string = body[0] as string;

                console.info('*** RUNTIME ERROR');
                if (lineNumber !== undefined) {
                    console.info(' AT LINE %03d', lineNumber);
                }
                console.info(': ' + errorMessage);
                break;
            }

            case MessageType.INTERPRETER_SUMMARY: {
                let body : number[] = message.getBody() as number[];
                let executionCount : number = body[0] as number;
                let runtimeErrors : number = body[1] as number;
                let elapsedTime : number = body[2] as number;

                console.info(Pascal.INTERPRETER_SUMMARY_FORMAT,
                                  executionCount, runtimeErrors,
                                  elapsedTime);
                break;
            }

            case MessageType.COMPILER_SUMMARY: {
                let body : number[] = message.getBody() as number[];
                let instructionCount : number = body[0] as number;
                let elapsedTime : number = body[1] as number;

                console.info(Pascal.COMPILER_SUMMARY_FORMAT,
                                  instructionCount, elapsedTime);
                break;
            }
        }
    }
}

/**
 * Listener for source messages.
 */
class SourceMessageListener implements MessageListener {
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
                
                console.info(Pascal.SOURCE_LINE_FORMAT,
                                        lineNumber, lineText);
                break;
            }
        }
    }
}

/**
 * Listener for parser messages.
 */
class ParserMessageListener implements MessageListener {
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

                // TODO format output
                let line = console.info(Pascal.PARSER_SUMMARY_FORMAT,
                                  statementCount, syntaxErrors,
                                  elapsedTime);
                console.info(line);
                break;
            }

            case MessageType.SYNTAX_ERROR: {
                let body : Object[] = message.getBody() as Object[];
                let lineNumber : number = body[0] as number;
                let position : number = body[1] as number;
                let tokenText : string = body[2] as string;
                let errorMessage : string = body[3] as string;

                let spaceCount : number = Pascal.PREFIX_WIDTH + position;
                let flagBuffer : string = '';

                // Spaces up to the error position.
                for (let i = 0; i < spaceCount; i++) {
                    flagBuffer += ' ';
                }

                // A pointer to the error followed by the error message.
                flagBuffer +=  '^\n*** ' + errorMessage;

                // Text, if any, of the bad token.
                if (tokenText !== undefined) {
                    flagBuffer += ' [at \'' + tokenText
                        + '\']';
                }

                console.info(flagBuffer);
                break;
            }
        }
    }
}