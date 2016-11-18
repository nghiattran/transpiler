import {StatementParser} from './StatementParser';
import {ExpressionParser} from './ExpressionParser';
import {CallParser} from './CallParser';

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

export class CallDeclaredParser extends CallParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    /**
     * Parse a call to a declared procedure or function.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode{
        // Create the CALL node.
        let callNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.CALL);
        let pfId : SymTabEntry = CallDeclaredParser.symTabStack.lookup(token.getText().toLowerCase());
        callNode.setAttribute(ICodeKeyImpl.ID, pfId);
        callNode.setTypeSpec(pfId.getTypeSpec());

        token = this.nextToken();  // consume procedure or function identifier

        let parmsNode : ICodeNode = this.parseActualParameters(token, pfId,
                                                    true, false, false);

        callNode.addChild(parmsNode);
        return callNode;
    }
}
