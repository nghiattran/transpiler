"use strict";
var Source_1 = require('./frontend/Source');
var MessageType_1 = require('./message/MessageType');
var SymTabKeyImpl_1 = require('./intermediate/symtabimpl/SymTabKeyImpl');
var List_1 = require('./util/List');
var Transpiler = (function () {
    function Transpiler(language) {
        this.language = language;
        this.USAGE = 'Usage: {{language}} execute|compile '.replace('{{language}}', this.language.languageName)
            + Transpiler.FLAGS + ' <source file path>';
    }
    Transpiler.prototype.setCompiler = function (language) {
        this.language = language;
    };
    Transpiler.prototype.parse = function (text, intermediateHandlers) {
        try {
            this.source = new Source_1.Source(text);
            this.source.addMessageListener(new SourceMessageListener());
            this.language.setSource(this.source);
            this.parser = this.language.getParser();
            this.parser.addMessageListener(new ParserMessageListener());
            this.parser.parse();
            this.source.close();
            if (this.parser.getErrorCount() === 0) {
                this.symTabStack = this.parser.getSymTabStack();
                var programId = this.symTabStack.getProgramId();
                this.iCode = programId.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.ROUTINE_ICODE);
            }
        }
        catch (ex) {
            console.info(ex);
            console.info('***** Internal translator error. *****');
        }
    };
    Transpiler.prototype.export = function (exporter) {
        if (this.symTabStack === undefined) {
            throw 'Nothing to parse yet.';
        }
        return exporter.export(this.symTabStack);
    };
    Transpiler.FLAGS = '[-ixlafcr]';
    Transpiler.SOURCE_LINE_FORMAT = '%d %s';
    Transpiler.PARSER_SUMMARY_FORMAT = '\n%d source lines.' +
        '\n%d syntax errors.' +
        '\n%d seconds total parsing time.\n';
    Transpiler.PREFIX_WIDTH = 5;
    Transpiler.INTERPRETER_SUMMARY_FORMAT = '\n%,20d statements executed.' +
        '\n%,20d runtime errors.' +
        '\n%,20.2f seconds total execution time.\n';
    Transpiler.COMPILER_SUMMARY_FORMAT = '\n%,20d instructions generated.' +
        '\n%,20.2f seconds total code generation time.\n';
    Transpiler.LINE_FORMAT = '>>> AT LINE %03d\n';
    Transpiler.ASSIGN_FORMAT = '>>> AT LINE %03d: %s = %s\n';
    Transpiler.FETCH_FORMAT = '>>> AT LINE %03d: %s : %s\n';
    Transpiler.CALL_FORMAT = '>>> AT LINE %03d: CALL %s\n';
    Transpiler.RETURN_FORMAT = '>>> AT LINE %03d: RETURN FROM %s\n';
    return Transpiler;
}());
exports.Transpiler = Transpiler;
var SourceMessageListener = (function () {
    function SourceMessageListener() {
        this.sourcelineReport = '';
    }
    SourceMessageListener.prototype.messageReceived = function (message) {
        var type = message.getType();
        var body = message.getBody();
        switch (type) {
            case MessageType_1.MessageType.SOURCE_LINE: {
                var lineNumber = body[0];
                var lineText = body[1];
                break;
            }
        }
    };
    return SourceMessageListener;
}());
var ParserMessageListener = (function () {
    function ParserMessageListener() {
        this.syntaxError = new List_1.List();
    }
    ParserMessageListener.prototype.messageReceived = function (message) {
        var type = message.getType();
        switch (type) {
            case MessageType_1.MessageType.PARSER_SUMMARY: {
                var body = message.getBody();
                var statementCount = body[0];
                var syntaxErrors = body[1];
                var elapsedTime = body[2];
                this.parserSummary = new ParserSummary(statementCount, syntaxErrors, elapsedTime);
                break;
            }
            case MessageType_1.MessageType.SYNTAX_ERROR: {
                var body = message.getBody();
                var lineNumber = body[0];
                var position = body[1];
                var tokenText = body[2];
                var errorMessage = body[3];
                this.syntaxError.add(new SyntacError(lineNumber, position, tokenText, errorMessage));
                break;
            }
        }
    };
    return ParserMessageListener;
}());
var SyntacError = (function () {
    function SyntacError(lineNumber, position, tokenText, errorMessage) {
        this.lineNumber = lineNumber;
        this.position = position;
        this.tokenText = tokenText;
        this.errorMessage = errorMessage;
    }
    SyntacError.prototype.toJson = function () {
        return {
            lineNumber: this.lineNumber,
            position: this.position,
            tokenText: this.tokenText,
            errorMessage: this.errorMessage
        };
    };
    SyntacError.prototype.toString = function () {
        var spaceCount = Transpiler.PREFIX_WIDTH + this.position;
        var flagBuffer = '';
        for (var i = 0; i < spaceCount; i++) {
            flagBuffer += ' ';
        }
        flagBuffer += '^\n*** ' + this.errorMessage;
        if (this.tokenText !== undefined) {
            flagBuffer += ' [at \'' + this.tokenText
                + '\']';
        }
        return flagBuffer;
    };
    return SyntacError;
}());
var ParserSummary = (function () {
    function ParserSummary(statementCount, syntaxErrors, elapsedTime) {
        this.statementCount = statementCount;
        this.syntaxErrors = syntaxErrors;
        this.elapsedTime = elapsedTime;
    }
    ParserSummary.prototype.toJson = function () {
        return {
            statementCount: this.statementCount,
            syntaxErrors: this.syntaxErrors,
            elapsedTime: this.elapsedTime
        };
    };
    ParserSummary.prototype.toString = function () {
        return '';
    };
    return ParserSummary;
}());
//# sourceMappingURL=Transpiler.js.map