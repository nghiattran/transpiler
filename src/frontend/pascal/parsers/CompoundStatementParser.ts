import {StatementParser} from './StatementParser';

import {PascalParserTD} from '../PascalParserTD';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {Token} from '../../Token';
import {Parser} from '../../Parser';
import {Source} from '../../Source';
import {TokenType} from '../../TokenType';

import {TypeForm} from '../../../intermediate/TypeForm';

import {ICodeNode} from '../../../intermediate/ICodeNode';
import {ICodeFactory} from '../../../intermediate/ICodeFactory';
import {SymTabEntry} from '../../../intermediate/SymTabEntry';
import {TypeFactory} from '../../../intermediate/TypeFactory';

import {ICodeNodeTypeImpl} from '../../../intermediate/icodeimpl/ICodeNodeTypeImpl';

import {List} from '../../../util/List';

export class CompoundStatementParser extends StatementParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParserTD) {
        super(parent);
    }

    /**
     * Parse a compound statement.
     * @param token the initial token.
     * @return the root node of the generated parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : ICodeNode {
        token = this.nextToken();  // consume the BEGIN

        // Create the COMPOUND node.
        let compoundNode : ICodeNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.COMPOUND);

        // Parse the statement list terminated by the END token.
        let statementParser : StatementParser = new StatementParser(this);
        statementParser.parseList(token, compoundNode, PascalTokenType.END, PascalErrorCode.MISSING_END);

        return compoundNode;
    }
}
