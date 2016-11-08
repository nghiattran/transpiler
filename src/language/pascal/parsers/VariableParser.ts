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
import {TypeFactory} from '../../../intermediate/TypeFactory';
import {ICodeNodeType} from '../../../intermediate/ICodeNodeType';
import {Definition} from '../../../intermediate/Definition';
import {RoutineCode} from '../../../intermediate/RoutineCode';
import {SymTab} from '../../../intermediate/SymTab';

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
     * Parse a letiable.
     * @param token the initial token.
     * @param letiableId the symbol table entry of the letiable identifier.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token, letiableId? : SymTabEntry) : ICodeNode{
        if(letiableId) {
            return this.parseTokenSymTab(token, letiableId);
        } else {
            return this.parseTokenOnly(token);
        }
    }

    /**
     * Parse a letiable.
     * @param token the initial token.
     * @param letiableId the symbol table entry of the letiable identifier.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parseTokenSymTab(token : Token, letiableId : SymTabEntry) : ICodeNode{
        // Check how the letiable is defined.
        let defnCode : Definition = letiableId.getDefinition();
        if (! ( (defnCode === DefinitionImpl.VARIABLE) || (defnCode === DefinitionImpl.VALUE_PARM) ||
                (defnCode === DefinitionImpl.VAR_PARM) ||
                (this.isFunctionTarget && (defnCode === DefinitionImpl.FUNCTION) )
              )
           )
        {
            VariableParser.errorHandler.flag(token, PascalErrorCode.INVALID_IDENTIFIER_USAGE, this);
        }

        letiableId.appendLineNumber(token.getLineNumber());

        let letiableNode : ICodeNode =
            ICodeFactory.createICodeNode(ICodeNodeTypeImpl.VARIABLE);
        letiableNode.setAttribute(ICodeKeyImpl.ID, letiableId);

        token = this.nextToken();  // consume the identifier
        let letiableType : TypeSpec = letiableId.getTypeSpec();

        if (!this.isFunctionTarget) {
            // Parse array subscripts or record fields.
            while (VariableParser.SUBSCRIPT_FIELD_START_SET.contains(<PascalTokenType>token.getType())) {
                let subFldNode : ICodeNode = token.getType() === PascalTokenType.LEFT_BRACKET
                                       ? this.parseSubscripts(letiableType)
                                       : this.parseField(letiableType);
                token = this.currentToken();

                // Update the letiable's type.
                // The letiable node adopts the SUBSCRIPTS or FIELD node.
                letiableType = subFldNode.getTypeSpec();
                letiableNode.addChild(subFldNode);
            }
        }

        letiableNode.setTypeSpec(letiableType);
        
        return letiableNode;
    }

    /**
     * Parse a letiable.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parseTokenOnly(token : Token) : ICodeNode {
        // Look up the identifier in the symbol table stack.
        let name : string = token.getText().toLowerCase();
        let letiableId : SymTabEntry = VariableParser.symTabStack.lookup(name);

        // If not found, flag the error and enter the identifier
        // as an undefined identifier with an undefined type.
        if (letiableId === undefined) {
            VariableParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_UNDEFINED, this);
            letiableId = VariableParser.symTabStack.enterLocal(name);
            letiableId.setDefinition(DefinitionImpl.UNDEFINED);
            letiableId.setTypeSpec(Predefined.undefinedType);
        }

        return this.parse(token, letiableId);
    }

    /**
     * Parse a set of comma-separated subscript expressions.
     * @param letiableType the type of the array letiable.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseSubscripts(letiableType : TypeSpec) : ICodeNode{
        let token : Token;
        let expressionParser : ExpressionParser = new ExpressionParser(this);

        // Create a SUBSCRIPTS node.
        let subscriptsNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.SUBSCRIPTS);

        do {
            token = this.nextToken();  // consume the [ or , token

            // The current letiable is an array.
            if (letiableType.getForm() === TypeFormImpl.ARRAY) {

                // Parse the subscript expression.
                let exprNode : ICodeNode = expressionParser.parse(token);
                let exprType : TypeSpec = exprNode !== undefined ? exprNode.getTypeSpec()
                                                     : Predefined.undefinedType;

                // The subscript expression type must be assignment
                // compatible with the array index type.
                let indexType : TypeSpec =
                    <TypeSpec> letiableType.getAttribute(TypeKeyImpl.ARRAY_INDEX_TYPE);
                if (!TypeChecker.areAssignmentCompatible(indexType, exprType)) {
                    VariableParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
                }

                // The SUBSCRIPTS node adopts the subscript expression tree.
                subscriptsNode.addChild(exprNode);

                // Update the letiable's type.
                letiableType =
                    <TypeSpec> letiableType.getAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE);
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

        subscriptsNode.setTypeSpec(letiableType);
        return subscriptsNode;
    }

    /**
     * Parse a record field.
     * @param letiableType the type of the record letiable.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    private parseField(letiableType : TypeSpec) : ICodeNode {
        // Create a FIELD node.
        let fieldNode : ICodeNode = ICodeFactory.createICodeNode(DefinitionImpl.FIELD);

        let token : Token = this.nextToken();  // consume the . token
        let tokenType : TokenType = token.getType();
        let letiableForm : TypeForm = letiableType.getForm();

        if ((tokenType === PascalTokenType.IDENTIFIER) && (letiableForm === TypeFormImpl.RECORD)) {
            let symTab : SymTab = <SymTab> letiableType.getAttribute(TypeKeyImpl.RECORD_SYMTAB);
            let fieldName : string = token.getText().toLowerCase();
            let fieldId : SymTabEntry = symTab.lookup(fieldName);

            if (fieldId !== undefined) {
                letiableType = fieldId.getTypeSpec();
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

        fieldNode.setTypeSpec(letiableType);
        return fieldNode;
    }
}
