import {StatementParser} from './StatementParser';
import {ExpressionParser} from './ExpressionParser';

import {PascalParser} from '../PascalParser';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';
import {EofToken} from '../../EofToken';

import {Token} from '../../Token';
import {Parser} from '../../Parser';
import {Source} from '../../Source';
import {TokenType} from '../../TokenType';

import {TypeForm} from '../../../intermediate/TypeForm';
import {ICodeNode} from '../../../intermediate/ICodeNode';
import {ICodeFactory} from '../../../intermediate/ICodeFactory';
import {TypeSpec} from '../../../intermediate/TypeSpec';
import {SymTabEntry} from '../../../intermediate/SymTabEntry';
import {TypeFactory} from '../../../intermediate/TypeFactory';
import {ICodeNodeType} from '../../../intermediate/ICodeNodeType';
import {Definition} from '../../../intermediate/Definition';
import {RoutineCode} from '../../../intermediate/RoutineCode';

import {TypeFormImpl} from '../../../intermediate/typeimpl/TypeFormImpl';
import {TypeKeyImpl} from '../../../intermediate/typeimpl/TypeKeyImpl';
import {TypeChecker} from '../../../intermediate/typeimpl/TypeChecker';

import {Predefined} from '../../../intermediate/symtabimpl/Predefined';
import {DefinitionImpl} from '../../../intermediate/symtabimpl/DefinitionImpl';
import {SymTabKeyImpl} from '../../../intermediate/symtabimpl/SymTabKeyImpl';
import {RoutineCodeImpl} from '../../../intermediate/symtabimpl/RoutineCodeImpl';

import {ICodeNodeTypeImpl} from '../../../intermediate/icodeimpl/ICodeNodeTypeImpl';
import {ICodeKeyImpl} from '../../../intermediate/icodeimpl/ICodeKeyImpl';

import {List} from '../../../util/List';
import {Util} from '../../../util/Util';
import {HashMap} from '../../../util/HashMap';

export class CaseStatementParser extends StatementParser
{
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for starting a CASE option constant.
    private static CONSTANT_START_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.IDENTIFIER, 
            PascalTokenType.INTEGER, 
            PascalTokenType.PLUS, 
            PascalTokenType.MINUS, 
            PascalTokenType.STRING]);

    // Synchronization set for OF.
    private static OF_SET : List<PascalTokenType> =
        CaseStatementParser.CONSTANT_START_SET.clone();
    
    // Synchronization set for COMMA.
    private static COMMA_SET : List<PascalTokenType> =
        CaseStatementParser.CONSTANT_START_SET.clone();

    static initialize() : void {
        CaseStatementParser.OF_SET.add(PascalTokenType.OF);
        CaseStatementParser.OF_SET.addAll(StatementParser.STMT_FOLLOW_SET);
        
        CaseStatementParser.COMMA_SET.add(PascalTokenType.COMMA);
        CaseStatementParser.COMMA_SET.add(PascalTokenType.COLON);
        CaseStatementParser.COMMA_SET.addAll(StatementParser.STMT_START_SET);
        CaseStatementParser.COMMA_SET.addAll(StatementParser.STMT_FOLLOW_SET);
    }

    /**
     * Parse a CASE statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode {
        token = this.nextToken();  // consume the CASE

        // Create a SELECT node.
        let selectNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.SELECT);

        // Parse the CASE expression.
        // The SELECT node adopts the expression subtree as its first child.
        let expressionParser : ExpressionParser = new ExpressionParser(this);
        let exprNode : ICodeNode = expressionParser.parse(token);
        selectNode.addChild(exprNode);

        // Type check: The CASE expression's type must be integer, character,
        //             or enumeration.
        let exprType : TypeSpec = exprNode !== undefined ? exprNode.getTypeSpec()
                                             : Predefined.undefinedType;
        if (!TypeChecker.isInteger(exprType) &&
            !TypeChecker.isChar(exprType) &&
            (exprType.getForm() !== TypeFormImpl.ENUMERATION))
        {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }

        // this.synchronize at the OF.
        token = this.synchronize(CaseStatementParser.OF_SET);
        if (token.getType() === PascalTokenType.OF) {
            token = this.nextToken();  // consume the OF
        }
        else {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_OF, this);
        }

        // Set of CASE branch constants.
        let constantSet : List<Object> = new List<Object>();

        // Loop to parse each CASE branch until the END token
        // or the end of the source file.
        while (!(token instanceof EofToken) && (token.getType() !== PascalTokenType.END)) {

            // The SELECT node adopts the CASE branch subtree.
            selectNode.addChild(this.parseBranch(token, exprType, constantSet));

            token = this.currentToken();
            let tokenType : TokenType = token.getType();

            // Look for the semicolon between CASE branches.
            if (tokenType === PascalTokenType.SEMICOLON) {
                token = this.nextToken();  // consume the ;
            }

            // If at the start of the next constant, then missing a semicolon.
            else if (CaseStatementParser.CONSTANT_START_SET.contains(<PascalTokenType>tokenType)) {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_SEMICOLON, this);
            }
        }

        // Look for the END token.
        if (token.getType() === PascalTokenType.END) {
            token = this.nextToken();  // consume END
        }
        else {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_END, this);
        }

        return selectNode;
    }

    /**
     * Parse a CASE branch.
     * @param token the current token.
     * @param expressionType the CASE expression type.
     * @param constantSet the set of CASE branch constants.
     * @return the root SELECT_BRANCH node of the subtree.
     * @throws Exception if an error occurred.
     */
    private parseBranch(
        token : Token, 
        expressionType : TypeSpec,
        constantSet : List<Object>) : ICodeNode
    {
        // Create an SELECT_BRANCH node and a SELECT_CONSTANTS node.
        // The SELECT_BRANCH node adopts the SELECT_CONSTANTS node as its
        // first child.
        let branchNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.SELECT_BRANCH);
        let constantsNode : ICodeNode =
                               ICodeFactory.createICodeNode(ICodeNodeTypeImpl.SELECT_CONSTANTS);
        branchNode.addChild(constantsNode);

        // Parse the list of CASE branch constants.
        // The SELECT_CONSTANTS node adopts each constant.
        this.parseConstantList(token, expressionType, constantsNode, constantSet);

        // Look for the : token.
        token = this.currentToken();
        if (token.getType() === PascalTokenType.COLON) {
            token = this.nextToken();  // consume the :
        }
        else {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_COLON, this);
        }

        // Parse the CASE branch statement. The SELECT_BRANCH node adopts
        // the statement subtree as its second child.
        let statementParser : StatementParser = new StatementParser(this);
        branchNode.addChild(statementParser.parse(token));

        return branchNode;
    }

    /**
     * Parse a list of CASE branch constants.
     * @param token the current token.
     * @param expressionType the CASE expression type.
     * @param constantsNode the parent SELECT_CONSTANTS node.
     * @param constantSet the set of CASE branch constants.
     * @throws Exception if an error occurred.
     */
    private parseConstantList(
        token : Token,
        expressionType : TypeSpec,
        constantsNode : ICodeNode,
        constantSet : List<Object>) : void
    {
        // Loop to parse each constant.
        while (CaseStatementParser.CONSTANT_START_SET.contains(<PascalTokenType> token.getType())) {

            // The constants list node adopts the constant node.
            constantsNode.addChild(this.parseConstant(token, expressionType,
                                                 constantSet));

            // this.synchronize at the comma between constants.
            token = this.synchronize(CaseStatementParser.COMMA_SET);

            // Look for the comma.
            if (token.getType() === PascalTokenType.COMMA) {
                token = this.nextToken();  // consume the ,
            }

            // If at the start of the next constant, then missing a comma.
            else if (CaseStatementParser.CONSTANT_START_SET.contains(<PascalTokenType> token.getType())) {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_COMMA, this);
            }
        }
    }

    /**
     * Parse CASE branch constant.
     * @param token the current token.
     * @param expressionType the CASE expression type.
     * @param constantSet the set of CASE branch constants.
     * @return the constant node.
     * @throws Exception if an error occurred.
     */
    private parseConstant(
        token : Token, 
        expressionType : TypeSpec,
        constantSet : List<Object>) : ICodeNode
    {
        let sign : TokenType = undefined;
        let constantNode : ICodeNode = undefined;
        let constantType : TypeSpec = undefined;

        // this.synchronize at the start of a constant.
        token = this.synchronize(CaseStatementParser.CONSTANT_START_SET);
        let tokenType : TokenType = token.getType();

        // Plus or minus sign?
        if ((tokenType === PascalTokenType.PLUS) || (tokenType === PascalTokenType.MINUS)) {
            sign = tokenType;
            token = this.nextToken();  // consume sign
        }

        // Parse the constant.
        switch (<PascalTokenType> token.getType()) {

            case PascalTokenType.IDENTIFIER: {
                constantNode = this.parseIdentifierConstant(token, sign);
                if (constantNode !== undefined) {
                    constantType = constantNode.getTypeSpec();
                }

                break;
            }

            case PascalTokenType.INTEGER: {
                constantNode = this.parseIntegerConstant(token.getText(), sign);
                constantType = Predefined.integerType;
                break;
            }

            case PascalTokenType.STRING: {
                constantNode =
                    this.parseCharacterConstant(token, <string> token.getValue(),
                                           sign);
                constantType = Predefined.charType;
                break;
            }

            default: {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this);
                break;
            }
        }

        // Check for reused constants.
        if (constantNode !== undefined) {
            let value : Object = constantNode.getAttribute(ICodeKeyImpl.VALUE);

            if (constantSet.contains(<PascalTokenType>value)) {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.CASE_CONSTANT_REUSED, this);
            }
            else {
                constantSet.add(value);
            }
        }

        // Type check: The constant type must be comparison compatible
        //             with the CASE expression type.
        if (!TypeChecker.areComparisonCompatible(expressionType,
                                                 constantType)) {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }

        token = this.nextToken();  // consume the constant

        constantNode.setTypeSpec(constantType);
        return constantNode;
    }

    /**
     * Parse an identifier CASE constant.
     * @param value the current token value string.
     * @param sign the sign, if any.
     * @return the constant node.
     */
    private parseIdentifierConstant(
        token : Token, 
        sign : TokenType) : ICodeNode
    {
        let constantNode : ICodeNode = undefined;
        let constantType : TypeSpec = undefined;

        // Look up the identifier in the symbol table stack.
        let name : string = token.getText().toLowerCase();
        let id : SymTabEntry = CaseStatementParser.symTabStack.lookup(name);

        // Undefined.
        if (id === undefined) {
            id = CaseStatementParser.symTabStack.enterLocal(name);
            id.setDefinition(DefinitionImpl.UNDEFINED);
            id.setTypeSpec(Predefined.undefinedType);
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_UNDEFINED, this);
            return undefined;
        }

        let defnCode : Definition = id.getDefinition();

        // Constant identifier.
        if ((defnCode === DefinitionImpl.CONSTANT) || (defnCode === DefinitionImpl.ENUMERATION_CONSTANT)) {
            let constantValue : Object = id.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
            constantType = id.getTypeSpec();

            // Type check: Leading sign permitted only for integer constants.
            if ((sign !== undefined) && !TypeChecker.isInteger(constantType)) {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this);
            }

            constantNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.INTEGER_CONSTANT);
            constantNode.setAttribute(ICodeKeyImpl.VALUE, constantValue);
        }

        id.appendLineNumber(token.getLineNumber());

        if (constantNode !== undefined) {
            constantNode.setTypeSpec(constantType);
        }

        return constantNode;
    }

    /**
     * Parse an integer CASE constant.
     * @param value the current token value string.
     * @param sign the sign, if any.
     * @return the constant node.
     */
    private parseIntegerConstant(
        value : string, 
        sign : TokenType) :ICodeNode
    {
        let constantNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.INTEGER_CONSTANT);
        let intValue : number = parseInt(value);

        if (sign === PascalTokenType.MINUS) {
            intValue = -intValue;
        }

        constantNode.setAttribute(ICodeKeyImpl.VALUE, intValue);
        return constantNode;
    }

    /**
     * Parse a character CASE constant.
     * @param token the current token.
     * @param value the token value string.
     * @param sign the sign, if any.
     * @return the constant node.
     */
    private parseCharacterConstant(
        token : Token, 
        value : string,
        sign : TokenType) : ICodeNode
    {
        let constantNode : ICodeNode = undefined;

        if (sign !== undefined) {
            CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this);
        }
        else {
            if (value.length === 1) {
                constantNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.STRING_CONSTANT);
                constantNode.setAttribute(ICodeKeyImpl.VALUE, value);
            }
            else {
                CaseStatementParser.errorHandler.flag(token, PascalErrorCode.INVALID_CONSTANT, this);
            }
        }

        return constantNode;
    }
}
