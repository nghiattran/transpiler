"use strict";
var Source_1 = require('./frontend/Source');
var FrontendFactory_1 = require('./frontend/FrontendFactory');
var MessageType_1 = require('./message/MessageType');
var CrossReferencer_1 = require('./util/CrossReferencer');
var fs = require("fs");
var util = require("util");
var Pascal = (function () {
    /**
     * Compile or interpret a Pascal source program.
     * @param operation either "compile" or "execute".
     * @param filePath the source file path.
     * @param flags the command line flags.
     */
    function Pascal(operation, text, flags) {
        try {
            this.intermediate = flags.indexOf('i') > -1;
            this.xref = flags.indexOf('x') > -1;
            this.lines = flags.indexOf('l') > -1;
            this.assign = flags.indexOf('a') > -1;
            this.fetch = flags.indexOf('f') > -1;
            this.call = flags.indexOf('c') > -1;
            this.returnn = flags.indexOf('r') > -1;
            // TODO : fix sourse
            this.source = new Source_1.Source(text);
            this.source.addMessageListener(new SourceMessageListener());
            this.parser = FrontendFactory_1.FrontendFactory.createParser("Pascal", "top-down", this.source);
            this.parser.addMessageListener(new ParserMessageListener());
            //            backend = BackendFactory.createBackend(operation);
            //            backend.addMessageListener(new BackendMessageListener());
            this.parser.parse();
            this.source.close();
            if (this.parser.getErrorCount() === 0) {
                this.symTabStack = this.parser.getSymTabStack();
                // var programId : SymTabEntry = this.symTabStack.getProgramId();
                // this.iCode = programId.getAttribute(SymTabKeyImpl.ROUTINE_ICODE) as ICode;
                console.log(this.xref);
                if (this.xref) {
                    var crossReferencer = new CrossReferencer_1.CrossReferencer();
                    crossReferencer.print(this.symTabStack);
                }
            }
        }
        catch (ex) {
            console.log(ex);
            console.log("***** Internal translator error. *****");
            ex.printStackTrace();
        }
    }
    /**
     * The main method.
     * @param args command-line arguments: "compile" or "execute" followed by
     *             optional flags followed by the source file path.
     */
    Pascal.main = function (args) {
        try {
            var operation = args[0];
            // Operation.
            if (!(operation.toLowerCase() === "compile"
                || operation.toLowerCase() === "execute")) {
                throw new Error();
            }
            var i = 0;
            var flags = "";
            // Flags.
            flags = args[1];
            // Source path.
            if (i < args.length) {
                var path = args[2];
                new Pascal(operation, path, flags);
            }
            else {
                throw new Error();
            }
        }
        catch (ex) {
            console.log(this.USAGE);
        }
    };
    Pascal.FLAGS = "[-ixlafcr]";
    Pascal.USAGE = "Usage: Pascal execute|compile " + Pascal.FLAGS + " <source file path>";
    Pascal.SOURCE_LINE_FORMAT = "%d %s";
    Pascal.PARSER_SUMMARY_FORMAT = "\n%d source lines." +
        "\n%d syntax errors." +
        "\n%d seconds total parsing time.\n";
    Pascal.PREFIX_WIDTH = 5;
    Pascal.INTERPRETER_SUMMARY_FORMAT = "\n%,20d statements executed." +
        "\n%,20d runtime errors." +
        "\n%,20.2f seconds total execution time.\n";
    Pascal.COMPILER_SUMMARY_FORMAT = "\n%,20d instructions generated." +
        "\n%,20.2f seconds total code generation time.\n";
    Pascal.LINE_FORMAT = ">>> AT LINE %03d\n";
    Pascal.ASSIGN_FORMAT = ">>> AT LINE %03d: %s = %s\n";
    Pascal.FETCH_FORMAT = ">>> AT LINE %03d: %s : %s\n";
    Pascal.CALL_FORMAT = ">>> AT LINE %03d: CALL %s\n";
    Pascal.RETURN_FORMAT = ">>> AT LINE %03d: RETURN FROM %s\n";
    return Pascal;
}());
exports.Pascal = Pascal;
/**
 * Listener for back end messages.
 */
var BackendMessageListener = (function () {
    function BackendMessageListener(parent) {
        this.parent = parent;
    }
    /**
     * Called by the back end whenever it produces a message.
     * @param message the message.
     */
    BackendMessageListener.prototype.messageReceived = function (message) {
        var type = message.getType();
        switch (type) {
            case MessageType_1.MessageType.SOURCE_LINE: {
                if (this.parent.lines) {
                    var lineNumber = message.getBody();
                }
                break;
            }
            case MessageType_1.MessageType.ASSIGN: {
                if (this.parent.assign) {
                    var body = message.getBody();
                    var lineNumber = body[0];
                    var variableName = body[1];
                    var value = body[2];
                }
                break;
            }
            case MessageType_1.MessageType.FETCH: {
                if (this.parent.fetch) {
                    var body = message.getBody();
                    var lineNumber = body[0];
                    var variableName = body[1];
                    var value = body[2];
                }
                break;
            }
            case MessageType_1.MessageType.CALL: {
                if (this.parent.call) {
                    var body = message.getBody();
                    var lineNumber = body[0];
                    var routineName = body[1];
                }
                break;
            }
            case MessageType_1.MessageType.RETURN: {
                if (this.parent.returnn) {
                    var body = message.getBody();
                    var lineNumber = body[0];
                    var routineName = body[1];
                }
                break;
            }
            case MessageType_1.MessageType.RUNTIME_ERROR: {
                var body = message.getBody();
                var lineNumber = body[0];
                var errorMessage = body[0];
                console.log("*** RUNTIME ERROR");
                if (lineNumber != null) {
                }
                console.log(": " + errorMessage);
                break;
            }
            case MessageType_1.MessageType.INTERPRETER_SUMMARY: {
                var body = message.getBody();
                var executionCount = body[0];
                var runtimeErrors = body[1];
                var elapsedTime = body[2];
                // TODO: format
                // util.format(INTERPRETER_SUMMARY_FORMAT,
                //                   executionCount, runtimeErrors,
                //                   elapsedTime);
                break;
            }
            case MessageType_1.MessageType.COMPILER_SUMMARY: {
                var body = message.getBody();
                var instructionCount = body[0];
                var elapsedTime = body[1];
                // TODO: format
                // util.format(COMPILER_SUMMARY_FORMAT,
                //                   instructionCount, elapsedTime);
                break;
            }
        }
    };
    return BackendMessageListener;
}());
/**
 * Listener for source messages.
 */
var SourceMessageListener = (function () {
    function SourceMessageListener() {
    }
    /**
     * Called by the source whenever it produces a message.
     * @param message the message.
     */
    SourceMessageListener.prototype.messageReceived = function (message) {
        var type = message.getType();
        var body = message.getBody();
        switch (type) {
            case MessageType_1.MessageType.SOURCE_LINE: {
                var lineNumber = body[0];
                var lineText = body[1];
                // TODO format output
                console.log(util.format(Pascal.SOURCE_LINE_FORMAT, lineNumber, lineText));
                break;
            }
        }
    };
    return SourceMessageListener;
}());
/**
 * Listener for parser messages.
 */
var ParserMessageListener = (function () {
    function ParserMessageListener() {
    }
    /**
     * Called by the parser whenever it produces a message.
     * @param message the message.
     */
    ParserMessageListener.prototype.messageReceived = function (message) {
        var type = message.getType();
        switch (type) {
            case MessageType_1.MessageType.PARSER_SUMMARY: {
                var body = message.getBody();
                var statementCount = body[0];
                var syntaxErrors = body[1];
                var elapsedTime = body[2];
                console.log(body);
                // TODO format output
                var line = util.format(Pascal.PARSER_SUMMARY_FORMAT, statementCount, syntaxErrors, elapsedTime);
                console.log(line);
                break;
            }
            case MessageType_1.MessageType.SYNTAX_ERROR: {
                var body = message.getBody();
                var lineNumber = body[0];
                var position = body[1];
                var tokenText = body[2];
                var errorMessage = body[3];
                var spaceCount = Pascal.PREFIX_WIDTH + position;
                var flagBuffer = '';
                // Spaces up to the error position.
                for (var i = 0; i < spaceCount; i++) {
                    flagBuffer += ' ';
                }
                // A pointer to the error followed by the error message.
                flagBuffer += "^\n*** " + errorMessage;
                // Text, if any, of the bad token.
                if (tokenText != null) {
                    flagBuffer += " [at \"" + tokenText
                        + "\"]";
                }
                console.log(flagBuffer);
                break;
            }
        }
    };
    return ParserMessageListener;
}());
var text = fs.readFileSync('./test.pas', 'utf8');
Pascal.main(['compile', 'xi', text]);
