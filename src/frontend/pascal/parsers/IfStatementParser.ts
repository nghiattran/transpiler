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

export class IfStatementParser extends StatementParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for THEN.
    private static THEN_SET : List<PascalTokenType> =
        StatementParser.STMT_START_SET.clone();

    static initialize() : void {
        IfStatementParser.THEN_SET.add(PascalTokenType.THEN);
        IfStatementParser.THEN_SET.addAll(StatementParser.STMT_FOLLOW_SET);
    }

    /**
     * Parse an IF statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode {
        token = this.nextToken();  // consume the IF
        
        // Create an IF node.
        let ifNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.IF);

        // Parse the expression.
        // The IF node adopts the expression subtree as its first child.
        let expressionParser : ExpressionParser = new ExpressionParser(this);
        let exprNode : ICodeNode = expressionParser.parse(token);
        ifNode.addChild(exprNode);

        // Type check: The expression type must be boolean.
        let exprType : TypeSpec = exprNode !== undefined ? exprNode.getTypeSpec()
                                             : Predefined.undefinedType;
        if (!TypeChecker.isBoolean(exprType)) {
            IfStatementParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }

        // this.synchronize at the THEN.
        token = this.synchronize(IfStatementParser.THEN_SET);
        if (token.getType() === PascalTokenType.THEN) {
            token = this.nextToken();  // consume the THEN
        }
        else {
            IfStatementParser.errorHandler.flag(token, PascalErrorCode.MISSING_THEN, this);
        }

        // Parse the THEN statement.
        // The IF node adopts the statement subtree as its second child.
        let statementParser : StatementParser = new StatementParser(this);
        ifNode.addChild(statementParser.parse(token));
        token = this.currentToken();

        // Look for an ELSE.
        if (token.getType() === PascalTokenType.ELSE) {
            token = this.nextToken();  // consume the THEN

            // Parse the ELSE statement.
            // The IF node adopts the statement subtree as its third child.
            ifNode.addChild(statementParser.parse(token));
        }

        return ifNode;
    }
}

IfStatementParser.initialize();