import {VariableParser} from './VariableParser';
import {StatementParser} from './StatementParser';
import {ExpressionParser} from './ExpressionParser';

import {PascalParser} from '../PascalParser';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

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

import {TypeFormImpl} from '../../../intermediate/typeimpl/TypeFormImpl';
import {TypeKeyImpl} from '../../../intermediate/typeimpl/TypeKeyImpl';
import {TypeChecker} from '../../../intermediate/typeimpl/TypeChecker';

import {ICodeNodeTypeImpl} from '../../../intermediate/icodeimpl/ICodeNodeTypeImpl';

import {Predefined} from '../../../intermediate/symtabimpl/Predefined';

import {List} from '../../../util/List';

export class AssignmentStatementParser extends StatementParser {
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

    // Synchronization set for the := token.
    private static COLON_EQUALS_SET : List<PascalTokenType> =
        ExpressionParser.EXPR_START_SET.clone();

    public static initialize() : void {
        AssignmentStatementParser.COLON_EQUALS_SET.add(PascalTokenType.COLON_EQUALS);
        AssignmentStatementParser.COLON_EQUALS_SET.addAll(StatementParser.STMT_FOLLOW_SET);
    }

    /**
     * Parse an assignment statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode{
        // Create the ASSIGN node.
        let assignNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.ASSIGN);

        // Parse the target variable.
        let variableParser : VariableParser = new VariableParser(this);
        let targetNode : ICodeNode = this.isFunctionTarget
                               ? variableParser.parseFunctionNameTarget(token)
                               : variableParser.parse(token);
        let targetType : TypeSpec = targetNode !== undefined ? targetNode.getTypeSpec()
                                                 : Predefined.undefinedType;

        // The ASSIGN node adopts the variable node as its first child.
        assignNode.addChild(targetNode);

        // Synchronize on the := token.
        token = this.synchronize(AssignmentStatementParser.COLON_EQUALS_SET);
        if (token.getType() === PascalTokenType.COLON_EQUALS) {
            token = this.nextToken();  // consume the :=
        }
        else {
            AssignmentStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_COLON_EQUALS, this);
        }

        // Parse the expression.  The ASSIGN node adopts the expression's
        // node as its second child.
        let expressionParser : ExpressionParser = new ExpressionParser(this);
        let exprNode : ICodeNode = expressionParser.parse(token);
        assignNode.addChild(exprNode);

        // Type check: Assignment compatible?
        let exprType : TypeSpec = exprNode !== undefined ? exprNode.getTypeSpec()
                                             : Predefined.undefinedType;
        if (!TypeChecker.areAssignmentCompatible(targetType, exprType)) {
            AssignmentStatementParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }

        assignNode.setTypeSpec(targetType);
        return assignNode;
    }

    /**
     * Parse an assignment to a function name.
     * @param token Token
     * @return ICodeNode
     * @throws Exception
     */
    public parseFunctionNameAssignment(token : Token) : ICodeNode{
        this.isFunctionTarget = true;
        return this.parse(token);
    }
}

AssignmentStatementParser.initialize();