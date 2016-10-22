"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PascalParserTD_1 = require('../PascalParserTD');
var PascalTokenType_1 = require('../PascalTokenType');
var PascalErrorCode_1 = require('../PascalErrorCode');
var EofToken_1 = require('../../EofToken');
var List_1 = require('../../../util/List');
var ICodeFactory_1 = require('../../../intermediate/ICodeFactory');
var ICodeNodeTypeImpl_1 = require('../../../intermediate/icodeimpl/ICodeNodeTypeImpl');
var ICodeKeyImpl_1 = require('../../../intermediate/icodeimpl/ICodeKeyImpl');
// import {CompoundStatementParser} from './CompoundStatementParser';
var StatementParser = (function (_super) {
    __extends(StatementParser, _super);
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    function StatementParser(parent) {
        _super.call(this, parent);
    }
    /**
     * Parse a statement.
     * To be overridden by the specialized statement parser subclasses.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    StatementParser.prototype.parse = function (token) {
        var statementNode = null;
        switch (token.getType()) {
            case PascalTokenType_1.PascalTokenType.BEGIN: {
                // CompoundStatementParser compoundParser =
                //     new CompoundStatementParser(this);
                // statementNode = compoundParser.parse(token);
                break;
            }
            // case IDENTIFIER: {
            //     String name = token.getText().toLowerCase();
            //     SymTabEntry id = symTabStack.lookup(name);
            //     Definition idDefn = id != null ? id.getDefinition()
            //                                    : UNDEFINED;
            //     // Assignment statement or procedure call.
            //     switch ((DefinitionImpl) idDefn) {
            //         case VARIABLE:
            //         case VALUE_PARM:
            //         case VAR_PARM:
            //         case UNDEFINED: {
            //             AssignmentStatementParser assignmentParser =
            //                 new AssignmentStatementParser(this);
            //             statementNode = assignmentParser.parse(token);
            //             break;
            //         }
            //         case FUNCTION: {
            //             AssignmentStatementParser assignmentParser =
            //                 new AssignmentStatementParser(this);
            //             statementNode =
            //                 assignmentParser.parseFunctionNameAssignment(token);
            //             break;
            //         }
            //         case PROCEDURE: {
            //             CallParser callParser = new CallParser(this);
            //             statementNode = callParser.parse(token);
            //             break;
            //         }
            //         default: {
            //             errorHandler.flag(token, UNEXPECTED_TOKEN, this);
            //             token = nextToken();  // consume identifier
            //         }
            //     }
            //     break;
            // }
            // case REPEAT: {
            //     RepeatStatementParser repeatParser =
            //         new RepeatStatementParser(this);
            //     statementNode = repeatParser.parse(token);
            //     break;
            // }
            // case WHILE: {
            //     WhileStatementParser whileParser =
            //         new WhileStatementParser(this);
            //     statementNode = whileParser.parse(token);
            //     break;
            // }
            // case FOR: {
            //     ForStatementParser forParser = new ForStatementParser(this);
            //     statementNode = forParser.parse(token);
            //     break;
            // }
            // case IF: {
            //     IfStatementParser ifParser = new IfStatementParser(this);
            //     statementNode = ifParser.parse(token);
            //     break;
            // }
            // case CASE: {
            //     CaseStatementParser caseParser = new CaseStatementParser(this);
            //     statementNode = caseParser.parse(token);
            //     break;
            // }
            default: {
                statementNode = ICodeFactory_1.ICodeFactory.createICodeNode(ICodeNodeTypeImpl_1.ICodeNodeTypeImpl.NO_OP);
                break;
            }
        }
        // Set the current line number as an attribute.
        this.setLineNumber(statementNode, token);
        return statementNode;
    };
    /**
     * Set the current line number as a statement node attribute.
     * @param node ICodeNode
     * @param token Token
     */
    StatementParser.prototype.setLineNumber = function (node, token) {
        if (node != null) {
            node.setAttribute(ICodeKeyImpl_1.ICodeKeyImpl.LINE, token.getLineNumber());
        }
    };
    /**
     * Parse a statement list.
     * @param token the curent token.
     * @param parentNode the parent node of the statement list.
     * @param terminator the token type of the node that terminates the list.
     * @param errorCode the error code if the terminator token is missing.
     * @throws Exception if an error occurred.
     */
    StatementParser.prototype.parseList = function (token, parentNode, terminator, errorCode) {
        // Synchronization set for the terminator.
        var terminatorSet = StatementParser.STMT_START_SET.clone();
        terminatorSet.add(terminator);
        // Loop to parse each statement until the END token
        // or the end of the source file.
        while (!(token instanceof EofToken_1.EofToken) &&
            (token.getType() != terminator)) {
            // Parse a statement.  The parent node adopts the statement node.
            var statementNode = this.parse(token);
            parentNode.addChild(statementNode);
            token = this.currentToken();
            var tokenType = token.getType();
            // Look for the semicolon between statements.
            if (tokenType == PascalTokenType_1.PascalTokenType.SEMICOLON) {
                token = this.nextToken(); // consume the ;
            }
            else if (StatementParser.STMT_START_SET.contains(tokenType)) {
                StatementParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_SEMICOLON, this);
            }
            // Synchronize at the start of the next statement
            // or at the terminator.
            token = this.synchronize(terminatorSet);
        }
        // Look for the terminator token.
        if (token.getType() == terminator) {
            token = this.nextToken(); // consume the terminator token
        }
        else {
            StatementParser.errorHandler.flag(token, errorCode, this);
        }
    };
    // Synchronization set for starting a statement.
    StatementParser.STMT_START_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.BEGIN,
        PascalTokenType_1.PascalTokenType.CASE,
        PascalTokenType_1.PascalTokenType.FOR,
        PascalTokenType_1.PascalTokenType.IF,
        PascalTokenType_1.PascalTokenType.REPEAT,
        PascalTokenType_1.PascalTokenType.WHILE,
        PascalTokenType_1.PascalTokenType.IDENTIFIER,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    // Synchronization set for following a statement.
    StatementParser.STMT_FOLLOW_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.SEMICOLON,
        PascalTokenType_1.PascalTokenType.END,
        PascalTokenType_1.PascalTokenType.ELSE,
        PascalTokenType_1.PascalTokenType.UNTIL,
        PascalTokenType_1.PascalTokenType.DOT]);
    return StatementParser;
}(PascalParserTD_1.PascalParserTD));
exports.StatementParser = StatementParser;
