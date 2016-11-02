import {PascalParserTD} from '../PascalParserTD';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {Token} from '../../Token';
import {TokenType} from '../../TokenType';
import {EofToken} from '../../EofToken';

import {List} from '../../../util/List';

import {TypeSpec} from '../../../intermediate/TypeSpec';
import {ICodeNode} from '../../../intermediate/ICodeNode';
import {ICodeFactory} from '../../../intermediate/ICodeFactory';

import {ICodeNodeTypeImpl} from '../../../intermediate/icodeimpl/ICodeNodeTypeImpl';
import {ICodeKeyImpl} from '../../../intermediate/icodeimpl/ICodeKeyImpl';

// import {CompoundStatementParser} from './CompoundStatementParser';

export class StatementParser extends PascalParserTD {
    // Synchronization set for starting a statement.
    public static STMT_START_SET : List<PascalTokenType> = new List<PascalTokenType>([
        PascalTokenType.BEGIN, 
        PascalTokenType.CASE, 
        PascalTokenType.FOR, 
        PascalTokenType.IF, 
        PascalTokenType.REPEAT, 
        PascalTokenType.WHILE,
        PascalTokenType.IDENTIFIER, 
        PascalTokenType.SEMICOLON]);

    // Synchronization set for following a statement.
    public static STMT_FOLLOW_SET : List<PascalTokenType> = new List<PascalTokenType>([
        PascalTokenType.SEMICOLON, 
        PascalTokenType.END,
        PascalTokenType.ELSE,
        PascalTokenType.UNTIL,
        PascalTokenType.DOT]);

    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParserTD) {
        super(parent);
    }

    /**
     * Parse a statement.
     * To be overridden by the specialized statement parser subclasses.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token): ICodeNode {
        let statementNode : ICodeNode= null;

        switch (<PascalTokenType> token.getType()) {

            case PascalTokenType.BEGIN: {
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
                statementNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.NO_OP);
                break;
            }
        }

        // Set the current line number as an attribute.
        this.setLineNumber(statementNode, token);

        return statementNode;
    }

    /**
     * Set the current line number as a statement node attribute.
     * @param node ICodeNode
     * @param token Token
     */
    protected setLineNumber(node : ICodeNode, token : Token) : void {
        if (node != null) {
            node.setAttribute(ICodeKeyImpl.LINE, token.getLineNumber());
        }
    }

    /**
     * Parse a statement list.
     * @param token the curent token.
     * @param parentNode the parent node of the statement list.
     * @param terminator the token type of the node that terminates the list.
     * @param errorCode the error code if the terminator token is missing.
     * @throws Exception if an error occurred.
     */
    public parseList(token : Token, parentNode : ICodeNode,
                             terminator : PascalTokenType,
                             errorCode : PascalErrorCode) : void
    {
        // Synchronization set for the terminator.
        let terminatorSet : List<PascalTokenType> = StatementParser.STMT_START_SET.clone();
        terminatorSet.add(terminator);

        // Loop to parse each statement until the END token
        // or the end of the source file.
        while (!(token instanceof EofToken) &&
               (token.getType() != terminator)) {

            // Parse a statement.  The parent node adopts the statement node.
            let statementNode : ICodeNode = this.parse(token);
            parentNode.addChild(statementNode);

            token = this.currentToken();
            let tokenType : TokenType = token.getType();

            // Look for the semicolon between statements.
            if (tokenType == PascalTokenType.SEMICOLON) {
                token = this.nextToken();  // consume the ;
            }

            // If at the start of the next statement, then missing a semicolon.
            else if (StatementParser.STMT_START_SET.contains(tokenType as PascalTokenType)) {
                StatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this);
            }

            // Synchronize at the start of the next statement
            // or at the terminator.
            token = this.synchronize(terminatorSet);
        }

        // Look for the terminator token.
        if (token.getType() == terminator) {
            token = this.nextToken();  // consume the terminator token
        }
        else {
            StatementParser.errorHandler.flag(token, errorCode, this);
        }
    }
}
