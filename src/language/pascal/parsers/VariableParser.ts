import {StatementParser} from './StatementParser';
import {ExpressionParser} from './ExpressionParser';
import {CallStandardParser} from './CallStandardParser';
import {CallDeclaredParser} from './CallDeclaredParser';

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
import {RoutineCode} from '../../../intermediate/RoutineCode';
import {SymTab} from '../../../intermediate/SymTab';

import {TypeFormImpl} from '../intermediate/typeimpl/TypeFormImpl';
import {TypeKeyImpl} from '../intermediate/typeimpl/TypeKeyImpl';
import {TypeChecker} from '../intermediate/typeimpl/TypeChecker';

import {Predefined} from '../../../intermediate/symtabimpl/Predefined';
import {DefinitionImpl} from '../../../intermediate/symtabimpl/DefinitionImpl';
import {SymTabKeyImpl} from '../../../intermediate/symtabimpl/SymTabKeyImpl';
import {RoutineCodeImpl} from '../intermediate/RoutineCodeImpl';

import {ICodeNodeTypeImpl} from '../intermediate/ICodeNodeTypeImpl';
import {ICodeKeyImpl} from '../../../intermediate/icodeimpl/ICodeKeyImpl';

import {List} from '../../../util/List';
import {Util} from '../../../util/Util';
import {HashMap} from '../../../util/HashMap';

export class VariableParser extends StatementParser {
    private static SUBSCRIPT_FIELD_START_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.LEFT_BRACKET, 
            PascalTokenType.DOT]);
    

    // Synchronization set for the ] token.
    private static RIGHT_BRACKET_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.RIGHT_BRACKET, 
            PascalTokenType.EQUALS, 
            PascalTokenType.SEMICOLON]);

    // Set to true to parse a function name
    // as the target of an assignment.
    private isFunctionTarget : boolean = false;

    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    /**
     * Parse a function name as the target of an assignment statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parseFunctionNameTarget(token : Token) : ICodeNode{
        this.isFunctionTarget = true;
        return this.parse(token);
    }

    /**
     * Parse a variable.
     * @param token the initial token.
     * @param variableId the symbol table entry of the variable identifier.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token, variableId? : SymTabEntry) : ICodeNode{
        if(variableId) {
            return this.parseTokenSymTab(token, variableId);
        } else {
            return this.parseTokenOnly(token);
        }
    }

    /**
     * Parse a variable.
     * @param token the initial token.
     * @param variableId the symbol table entry of the variable identifier.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parseTokenSymTab(token : Token, variableId : SymTabEntry) : ICodeNode{
        // Check how the variable is defined.
        let defnCode : Definition = variableId.getDefinition();
        if (! ( (defnCode === DefinitionImpl.VARIABLE) || (defnCode === DefinitionImpl.VALUE_PARM) ||
                (defnCode === DefinitionImpl.VAR_PARM) ||
                (this.isFunctionTarget && (defnCode === DefinitionImpl.FUNCTION) )
              )
           )
        {
            VariableParser.errorHandler.flag(token, PascalErrorCode.INVALID_IDENTIFIER_USAGE, this);
        }

        variableId.appendLineNumber(token.getLineNumber());

        let variableNode : ICodeNode =
            ICodeFactory.createICodeNode(ICodeNodeTypeImpl.VARIABLE);
        variableNode.setAttribute(ICodeKeyImpl.ID, variableId);

        token = this.nextToken();  // consume the identifier
        let variableType : TypeSpec = variableId.getTypeSpec();

        if (!this.isFunctionTarget) {
            // Parse array subscripts or record fields.
            while (VariableParser.SUBSCRIPT_FIELD_START_SET.contains(<PascalTokenType>token.getType())) {
                let subFldNode : ICodeNode = token.getType() === PascalTokenType.LEFT_BRACKET
                                       ? this.parseSubscripts(variableType)
                                       : this.parseField(variableType);
                token = this.currentToken();

                // Update the variable's type.
                // The variable node adopts the SUBSCRIPTS or FIELD node.
                variableType = subFldNode.getTypeSpec();
                variableNode.addChild(subFldNode);
            }
        }

        variableNode.setTypeSpec(variableType);
        
        return variableNode;
    }

    /**
     * Parse a variable.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parseTokenOnly(token : Token) : ICodeNode {
        // Look up the identifier in the symbol table stack.
        let name : string = token.getText().toLowerCase();
        let variableId : SymTabEntry = VariableParser.symTabStack.lookup(name);

        // If not found, flag the error and enter the identifier
        // as an undefined identifier with an undefined type.
        if (variableId === undefined) {
            VariableParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_UNDEFINED, this);
            variableId = VariableParser.symTabStack.enterLocal(name);
            variableId.setDefinition(DefinitionImpl.UNDEFINED);
            variableId.setTypeSpec(Predefined.undefinedType);
        }

        return this.parse(token, variableId);
    }

    /**
     * Parse a set of comma-separated subscript expressions.
     * @param variableType the type of the array variable.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseSubscripts(variableType : TypeSpec) : ICodeNode{
        let token : Token;
        let expressionParser : ExpressionParser = new ExpressionParser(this);

        // Create a SUBSCRIPTS node.
        let subscriptsNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.SUBSCRIPTS);

        do {
            token = this.nextToken();  // consume the [ or , token

            // The current variable is an array.
            if (variableType.getForm() === TypeFormImpl.ARRAY) {

                // Parse the subscript expression.
                let exprNode : ICodeNode = expressionParser.parse(token);
                let exprType : TypeSpec = exprNode !== undefined ? exprNode.getTypeSpec()
                                                     : Predefined.undefinedType;

                // The subscript expression type must be assignment
                // compatible with the array index type.
                let indexType : TypeSpec =
                    <TypeSpec> variableType.getAttribute(TypeKeyImpl.ARRAY_INDEX_TYPE);
                if (!TypeChecker.areAssignmentCompatible(indexType, exprType)) {
                    VariableParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                }

                // The SUBSCRIPTS node adopts the subscript expression tree.
                subscriptsNode.addChild(exprNode);

                // Update the variable's type.
                variableType =
                    <TypeSpec> variableType.getAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE);
            }

            // Not an array type, so too many subscripts.
            else {
                VariableParser.errorHandler.flag(token, PascalErrorCode.TOO_MANY_SUBSCRIPTS, this);
                expressionParser.parse(token);
            }

            token = this.currentToken();
        } while (token.getType() === PascalTokenType.COMMA);

        // Synchronize at the ] token.
        token = this.synchronize(VariableParser.RIGHT_BRACKET_SET);
        if (token.getType() === PascalTokenType.RIGHT_BRACKET) {
            token = this.nextToken();  // consume the ] token
        }
        else {
            VariableParser.errorHandler.flag(token, PascalErrorCode.MISSING_RIGHT_BRACKET, this);
        }

        subscriptsNode.setTypeSpec(variableType);
        return subscriptsNode;
    }

    /**
     * Parse a record field.
     * @param variableType the type of the record variable.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseField(variableType : TypeSpec) : ICodeNode {
        // Create a FIELD node.
        let fieldNode : ICodeNode = ICodeFactory.createICodeNode(DefinitionImpl.FIELD);

        let token : Token = this.nextToken();  // consume the . token
        let tokenType : TokenType = token.getType();
        let variableForm : TypeForm = variableType.getForm();

        if ((tokenType === PascalTokenType.IDENTIFIER) && (variableForm === TypeFormImpl.RECORD)) {
            let symTab : SymTab = <SymTab> variableType.getAttribute(TypeKeyImpl.RECORD_SYMTAB);
            let fieldName : string = token.getText().toLowerCase();
            let fieldId : SymTabEntry = symTab.lookup(fieldName);

            if (fieldId !== undefined) {
                variableType = fieldId.getTypeSpec();
                fieldId.appendLineNumber(token.getLineNumber());

                // Set the field identifier's name.
                fieldNode.setAttribute(ICodeKeyImpl.ID, fieldId);
            }
            else {
                VariableParser.errorHandler.flag(token, PascalErrorCode.INVALID_FIELD, this);
            }
        }
        else {
            VariableParser.errorHandler.flag(token, PascalErrorCode.INVALID_FIELD, this);
        }

        token = this.nextToken();  // consume the field identifier

        fieldNode.setTypeSpec(variableType);
        return fieldNode;
    }
}
