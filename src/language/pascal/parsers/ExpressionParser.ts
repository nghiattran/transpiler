import {StatementParser} from './StatementParser';
import {CallParser} from './CallParser';
import {VariableParser} from './VariableParser';

import {PascalParser} from '../PascalParser';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {Token} from '../../../frontend/Token';
import {Parser} from '../../../frontend/Parser';
import {Source} from '../../../frontend/Source';
import {TokenType} from '../../../frontend/TokenType';

import {TypeForm} from '../../../intermediate/TypeForm';
import {ICodeNode} from '../../../intermediate/ICodeNode';
import {ICodeFactory} from '../../../intermediate/ICodeFactory';
import {TypeSpec} from '../../../intermediate/TypeSpec';
import {SymTabEntry} from '../../../intermediate/SymTabEntry';
import {TypeFactory} from '../intermediate/TypeFactory';
import {ICodeNodeType} from '../../../intermediate/ICodeNodeType';
import {Definition} from '../../../intermediate/Definition';

import {TypeFormImpl} from '../intermediate/typeimpl/TypeFormImpl';
import {TypeKeyImpl} from '../intermediate/typeimpl/TypeKeyImpl';
import {TypeChecker} from '../intermediate/typeimpl/TypeChecker';

import {Predefined} from '../../../intermediate/symtabimpl/Predefined';
import {DefinitionImpl} from '../../../intermediate/symtabimpl/DefinitionImpl';
import {SymTabKeyImpl} from '../../../intermediate/symtabimpl/SymTabKeyImpl';

import {ICodeNodeTypeImpl} from '../intermediate/ICodeNodeTypeImpl';
import {ICodeKeyImpl} from '../../../intermediate/icodeimpl/ICodeKeyImpl';

import {List} from '../../../util/List';
import {Util} from '../../../util/Util';
import {HashMap} from '../../../util/HashMap';

export class ExpressionParser extends StatementParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for starting an expression.
    static EXPR_START_SET : List<PascalTokenType> =
        new List<PascalTokenType> ([
            PascalTokenType.PLUS, 
            PascalTokenType.MINUS, 
            PascalTokenType.IDENTIFIER, 
            PascalTokenType.INTEGER, 
            PascalTokenType.REAL, 
            PascalTokenType.STRING,
            PascalTokenType.NOT, 
            PascalTokenType.LEFT_PAREN]);

    // Set of relational operators.
    private static REL_OPS : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.EQUALS, 
            PascalTokenType.NOT_EQUALS, 
            PascalTokenType.LESS_THAN, 
            PascalTokenType.LESS_EQUALS,
            PascalTokenType.GREATER_THAN, 
            PascalTokenType.GREATER_EQUALS]);

    // Map relational operator tokens to node types.
    private static REL_OPS_MAP : HashMap<PascalTokenType, ICodeNodeType> = 
        new HashMap<PascalTokenType, ICodeNodeType>();

    // Set of additive operators.
    private static ADD_OPS : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.PLUS, 
            PascalTokenType.MINUS, 
            PascalTokenType.OR]);

    // Map additive operator tokens to node types.
    private static ADD_OPS_OPS_MAP : HashMap<PascalTokenType, ICodeNodeTypeImpl> =
        new HashMap<PascalTokenType, ICodeNodeTypeImpl>();
    
    // Set of multiplicative operators.
    private static MULT_OPS : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.STAR, 
            PascalTokenType.SLASH, 
            PascalTokenType.DIV, 
            PascalTokenType.MOD, 
            PascalTokenType.AND]);

    // Map multiplicative operator tokens to node types.
    private static MULT_OPS_OPS_MAP : HashMap<PascalTokenType, ICodeNodeType> = 
        new HashMap<PascalTokenType, ICodeNodeType>();

    static initialize() : void {
        ExpressionParser.REL_OPS_MAP.put(
            PascalTokenType.EQUALS, ICodeNodeTypeImpl.EQ);
        ExpressionParser.REL_OPS_MAP.put(
            PascalTokenType.NOT_EQUALS, ICodeNodeTypeImpl.NE);
        ExpressionParser.REL_OPS_MAP.put(
            PascalTokenType.LESS_THAN, ICodeNodeTypeImpl.LT);
        ExpressionParser.REL_OPS_MAP.put(
            PascalTokenType.LESS_EQUALS, ICodeNodeTypeImpl.LE);
        ExpressionParser.REL_OPS_MAP.put(
            PascalTokenType.GREATER_THAN, ICodeNodeTypeImpl.GT);
        ExpressionParser.REL_OPS_MAP.put(
            PascalTokenType.GREATER_EQUALS, ICodeNodeTypeImpl.GE);

        ExpressionParser.ADD_OPS_OPS_MAP.put(
            PascalTokenType.PLUS, ICodeNodeTypeImpl.ADD);
        ExpressionParser.ADD_OPS_OPS_MAP.put(
            PascalTokenType.MINUS, ICodeNodeTypeImpl.SUBTRACT);
        ExpressionParser.ADD_OPS_OPS_MAP.put(
            PascalTokenType.OR, ICodeNodeTypeImpl.OR);

        ExpressionParser.MULT_OPS_OPS_MAP.put(
            PascalTokenType.STAR, ICodeNodeTypeImpl.MULTIPLY);
        ExpressionParser.MULT_OPS_OPS_MAP.put(
            PascalTokenType.SLASH, ICodeNodeTypeImpl.FLOAT_DIVIDE);
        ExpressionParser.MULT_OPS_OPS_MAP.put(
            PascalTokenType.DIV, ICodeNodeTypeImpl.INTEGER_DIVIDE);
        ExpressionParser.MULT_OPS_OPS_MAP.put(
            PascalTokenType.MOD, ICodeNodeTypeImpl.MOD);
        ExpressionParser.MULT_OPS_OPS_MAP.put(
            PascalTokenType.AND, ICodeNodeTypeImpl.AND);
    };

    /**
     * Parse an expression.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode {
        return this.parseExpression(token);
    }

    /**
     * Parse an expression.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseExpression(token : Token) : ICodeNode {
        // Parse a simple expression and make the root of its tree
        // the root node.
        let rootNode : ICodeNode = this.parseSimpleExpression(token);
        let resultType : TypeSpec = rootNode !== undefined ? rootNode.getTypeSpec()
                                               : Predefined.undefinedType;

        token = this.currentToken();
        let tokenType : TokenType = token.getType();

        // Look for a relational operator.
        if (ExpressionParser.REL_OPS.contains(<PascalTokenType>tokenType)) {

            // Create a new operator node and adopt the current tree
            // as its first child.
            let nodeType : ICodeNodeType = ExpressionParser.REL_OPS_MAP.get(<PascalTokenType>tokenType);
            let opNode : ICodeNode = ICodeFactory.createICodeNode(nodeType);
            opNode.addChild(rootNode);

            token = this.nextToken();  // consume the operator

            // Parse the second simple expression.  The operator node adopts
            // the simple expression's tree as its second child.
            let simExprNode : ICodeNode = this.parseSimpleExpression(token);
            opNode.addChild(simExprNode);

            // The operator node becomes the new root node.
            rootNode = opNode;

            // Type check: The operands must be comparison compatible.
            let simExprType : TypeSpec = simExprNode !== undefined
                                       ? simExprNode.getTypeSpec()
                                       : Predefined.undefinedType;
            if (TypeChecker.areComparisonCompatible(resultType, simExprType)) {
                resultType = Predefined.booleanType;
            }
            else {
                ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                resultType = Predefined.undefinedType;
            }
        }

        if (rootNode !== undefined) {
            rootNode.setTypeSpec(resultType);
        }

        return rootNode;
    }

    /**
     * Parse a simple expression.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseSimpleExpression(token : Token) : ICodeNode{
        let signToken : Token = undefined;
        let signType : TokenType = undefined;  // type of leading sign (if any)

        // Look for a leading + or - sign.
        let tokenType : TokenType = token.getType();
        if ((tokenType === PascalTokenType.PLUS) || (tokenType === PascalTokenType.MINUS)) {
            signType = tokenType;
            signToken = token;
            token = this.nextToken();  // consume the + or -
        }

        // Parse a term and make the root of its tree the root node.
        let rootNode : ICodeNode = this.parseTerm(token);
        let resultType : TypeSpec = rootNode !== undefined ? rootNode.getTypeSpec()
                                               : Predefined.undefinedType;

        // Type check: Leading sign.
        if ((signType !== undefined) && (!TypeChecker.isIntegerOrReal(resultType))) {
            ExpressionParser.errorHandler.flag(signToken, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }

        // Was there a leading - sign?
        if (signType === PascalTokenType.MINUS) {

            // Create a NEGATE node and adopt the current tree
            // as its child. The NEGATE node becomes the new root node.
            let negateNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.NEGATE);
            negateNode.addChild(rootNode);
            negateNode.setTypeSpec(rootNode.getTypeSpec());
            rootNode = negateNode;
        }

        token = this.currentToken();
        tokenType = token.getType();

        // Loop over additive operators.
        while (ExpressionParser.ADD_OPS.contains(<PascalTokenType>tokenType)) {
            let operator : PascalTokenType = <PascalTokenType>tokenType;

            // Create a new operator node and adopt the current tree
            // as its first child.
            let nodeType : ICodeNodeType = ExpressionParser.ADD_OPS_OPS_MAP.get(<PascalTokenType>operator);
            let opNode : ICodeNode = ICodeFactory.createICodeNode(nodeType);
            opNode.addChild(rootNode);

            token = this.nextToken();  // consume the operator

            // Parse another term.  The operator node adopts
            // the term's tree as its second child.
            let termNode : ICodeNode = this.parseTerm(token);
            opNode.addChild(termNode);
            let termType : TypeSpec = termNode !== undefined ? termNode.getTypeSpec()
                                                 : Predefined.undefinedType;

            // The operator node becomes the new root node.
            rootNode = opNode;

            // Determine the result type.
            switch (<PascalTokenType> operator) {

                case PascalTokenType.PLUS:
                case PascalTokenType.MINUS: {
                    // Both operands integer ==> integer result.
                    if (TypeChecker.areBothInteger(resultType, termType)) {
                        resultType = Predefined.integerType;
                    }

                    // Both real operands or one real and one integer operand
                    // ==> real result.
                    else if (TypeChecker.isAtLeastOneReal(resultType,
                                                          termType)) {
                        resultType = Predefined.realType;
                    }

                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }

                    break;
                }

                case PascalTokenType.OR: {
                    // Both operands boolean ==> boolean result.
                    if (TypeChecker.areBothBoolean(resultType, termType)) {
                        resultType = Predefined.booleanType;
                    }
                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }

                    break;
                }
            }

            rootNode.setTypeSpec(resultType);

            token = this.currentToken();
            tokenType = token.getType();
        }

        return rootNode;
    }

    /**
     * Parse a term.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseTerm(token : Token) : ICodeNode {

        // Parse a factor and make its node the root node.
        let rootNode : ICodeNode = this.parseFactor(token);

        let resultType : TypeSpec = rootNode !== undefined ? rootNode.getTypeSpec()
                                               : Predefined.undefinedType;
        token = this.currentToken();

        let tokenType : TokenType = token.getType();
        

        // Loop over multiplicative operators.
        while (ExpressionParser.MULT_OPS.contains(<PascalTokenType>tokenType)) {
            let operator : TokenType = tokenType;

            // Create a new operator node and adopt the current tree
            // as its first child.
            let nodeType : ICodeNodeType = ExpressionParser.MULT_OPS_OPS_MAP.get(<PascalTokenType>operator);
            let opNode : ICodeNode = ICodeFactory.createICodeNode(nodeType);
            opNode.addChild(rootNode);

            token = this.nextToken();  // consume the operator

            // Parse another factor.  The operator node adopts
            // the term's tree as its second child.
            let factorNode : ICodeNode = this.parseFactor(token);
            opNode.addChild(factorNode);
            let factorType : TypeSpec = factorNode !== undefined ? factorNode.getTypeSpec()
                                                     : Predefined.undefinedType;

            // The operator node becomes the new root node.
            rootNode = opNode;

            // Determine the result type.
            switch (<PascalTokenType> operator) {

                case PascalTokenType.STAR: {
                    // Both operands integer ==> integer result.
                    if (TypeChecker.areBothInteger(resultType, factorType)) {
                        resultType = Predefined.integerType;
                    }

                    // Both real operands or one real and one integer operand
                    // ==> real result.
                    else if (TypeChecker.isAtLeastOneReal(resultType,
                                                          factorType)) {
                        resultType = Predefined.realType;
                    }

                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }

                    break;
                }

                case PascalTokenType.SLASH: {
                    // All integer and real operand combinations
                    // ==> real result.
                    if (TypeChecker.areBothInteger(resultType, factorType) ||
                        TypeChecker.isAtLeastOneReal(resultType, factorType))
                    {
                        resultType = Predefined.realType;
                    }
                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }

                    break;
                }

                case PascalTokenType.DIV:
                case PascalTokenType.MOD: {
                    // Both operands integer ==> integer result.
                    if (TypeChecker.areBothInteger(resultType, factorType)) {
                        resultType = Predefined.integerType;
                    }
                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }

                    break;
                }

                case PascalTokenType.AND: {
                    // Both operands boolean ==> boolean result.
                    if (TypeChecker.areBothBoolean(resultType, factorType)) {
                        resultType = Predefined.booleanType;
                    }
                    else {
                        ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                    }

                    break;
                }
            }

            rootNode.setTypeSpec(resultType);

            token = this.currentToken();
            tokenType = token.getType();
        }

        return rootNode;
    }

    /**
     * Parse a factor.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseFactor(token : Token) : ICodeNode {
        let tokenType : TokenType = token.getType();
        let rootNode : ICodeNode = undefined;

        switch (<PascalTokenType> tokenType) {
            case PascalTokenType.IDENTIFIER: {
                return this.parseIdentifier(token);
            }

            case PascalTokenType.INTEGER: {
                // Create an INTEGER_CONSTANT node as the root node.
                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.INTEGER_CONSTANT);
                rootNode.setAttribute(ICodeKeyImpl.VALUE, token.getValue());

                token = this.nextToken();  // consume the number

                rootNode.setTypeSpec(Predefined.integerType);
                break;
            }

            case PascalTokenType.REAL: {
                // Create an REAL_CONSTANT node as the root node.
                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.REAL_CONSTANT);
                rootNode.setAttribute(ICodeKeyImpl.VALUE, token.getValue());

                token = this.nextToken();  // consume the number

                rootNode.setTypeSpec(Predefined.realType);
                break;
            }

            case PascalTokenType.STRING: {
                let value : string = <string> token.getValue();

                // Create a.STRING_CONSTANT node as the root node.
                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.STRING_CONSTANT);
                rootNode.setAttribute(ICodeKeyImpl.VALUE, value);

                let resultType : TypeSpec = value.length === 1
                                          ? Predefined.charType
                                          : TypeFactory.createStringType(value);

                token = this.nextToken();  // consume the string

                rootNode.setTypeSpec(resultType);
                break;
            }

            case PascalTokenType.NOT: {
                token = this.nextToken();  // consume the NOT

                // Create a NOT node as the root node.
                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.NOT);

                // Parse the factor.  The NOT node adopts the
                // factor node as its child.
                let factorNode : ICodeNode = this.parseFactor(token);
                rootNode.addChild(factorNode);

                // Type check: The factor must be boolean.
                let factorType : TypeSpec = factorNode !== undefined
                                          ? factorNode.getTypeSpec()
                                          : Predefined.undefinedType;
                if (!TypeChecker.isBoolean(factorType)) {
                    ExpressionParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                }

                rootNode.setTypeSpec(Predefined.booleanType);
                break;
            }

            case PascalTokenType.LEFT_PAREN: {
                token = this.nextToken();      // consume the (

                // Parse an expression and make its node the root node.
                rootNode = this.parseExpression(token);
                let resultType : TypeSpec = rootNode !== undefined
                                          ? rootNode.getTypeSpec()
                                          : Predefined.undefinedType;

                // Look for the matching ) token.
                token = this.currentToken();
                if (token.getType() === PascalTokenType.RIGHT_PAREN) {
                    token = this.nextToken();  // consume the )
                }
                else {
                    ExpressionParser.errorHandler.flag(token, PascalErrorCode.MISSING_RIGHT_PAREN, this);
                }

                rootNode.setTypeSpec(resultType);
                break;
            }

            default: {
                ExpressionParser.errorHandler.flag(token, PascalErrorCode.UNEXPECTED_TOKEN, this);
            }
        }

        return rootNode;
    }

    /**
     * Parse an identifier.
     * @param token the current token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseIdentifier(token : Token) : ICodeNode {
        let rootNode : ICodeNode = undefined;

        // Look up the identifier in the symbol table stack.
        let name : string = token.getText().toLowerCase();
        let id : SymTabEntry = ExpressionParser.symTabStack.lookup(name);

        // Undefined.
        if (id === undefined) {
            ExpressionParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_UNDEFINED, this);
            id = ExpressionParser.symTabStack.enterLocal(name);
            id.setDefinition(DefinitionImpl.UNDEFINED);
            id.setTypeSpec(Predefined.undefinedType);
        }

        let defnCode : Definition = id.getDefinition();

        switch (<DefinitionImpl> defnCode) {

            case DefinitionImpl.CONSTANT: {
                let value : Object = id.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
                let type : TypeSpec = id.getTypeSpec();

                if (Util.isInteger(value)) {
                    rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.INTEGER_CONSTANT);
                    rootNode.setAttribute(ICodeKeyImpl.VALUE, value);
                }
                else if (Util.isFloat(value)) {
                    rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.REAL_CONSTANT);
                    rootNode.setAttribute(ICodeKeyImpl.VALUE, value);
                }
                else if (value instanceof String) {
                    rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.STRING_CONSTANT);
                    rootNode.setAttribute(ICodeKeyImpl.VALUE, value);
                }

                id.appendLineNumber(token.getLineNumber());
                token = this.nextToken();  // consume the constant identifier

                if (rootNode !== undefined) {
                    rootNode.setTypeSpec(type);
                }

                break;
            }

            case DefinitionImpl.ENUMERATION_CONSTANT: {
                let value : Object = id.getAttribute(SymTabKeyImpl.CONSTANT_VALUE);
                let type : TypeSpec = id.getTypeSpec();

                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.INTEGER_CONSTANT);
                rootNode.setAttribute(ICodeKeyImpl.VALUE, value);

                id.appendLineNumber(token.getLineNumber());
                token = this.nextToken();  // consume the enum constant identifier

                rootNode.setTypeSpec(type);
                break;
            }

            case DefinitionImpl.FUNCTION: {
                let callParser : CallParser = new CallParser(this);
                rootNode = callParser.parse(token);
                break;
            }

            default: {
                let variableParser : VariableParser = new VariableParser(this);
                rootNode = variableParser.parse(token, id);
                break;
            }
        }
        return rootNode;
    }
}

ExpressionParser.initialize();