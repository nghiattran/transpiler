import {StatementParser} from './StatementParser';
import {ExpressionParser} from './ExpressionParser';
import {AssignmentStatementParser} from './AssignmentStatementParser';
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

export class RepeatStatementParser extends StatementParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    /**
     * Parse a REPEAT statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode {
        token = this.nextToken();  // consume the REPEAT

        // Create the LOOP and TEST nodes.
        let loopNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.LOOP);
        let testNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.TEST);

        // Parse the statement list terminated by the UNTIL token.
        // The LOOP node is the parent of the statement subtrees.
        let statementParser : StatementParser = new StatementParser(this);
        statementParser.parseList(token, loopNode, PascalTokenType.UNTIL, PascalErrorCode.MISSING_UNTIL);
        token = this.currentToken();

        // Parse the expression.
        // The TEST node adopts the expression subtree as its only child.
        let expressionParser : ExpressionParser = new ExpressionParser(this);
        let exprNode : ICodeNode = expressionParser.parse(token);
        testNode.addChild(exprNode);
        loopNode.addChild(testNode);

        // Type check: The test expression must be boolean.
        let exprType : TypeSpec = exprNode !== undefined ? exprNode.getTypeSpec()
                                             : Predefined.undefinedType;
        if (!TypeChecker.isBoolean(exprType)) {
            RepeatStatementParser.errorHandler.flag(token, PascalErrorCode.INCOMPATIBLE_TYPES, this);
        }

        return loopNode;
    }
}
