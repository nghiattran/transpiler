import {StatementParser} from './StatementParser';
import {DeclarationsParser} from './DeclarationsParser';

import {PascalParser} from '../PascalParser';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {List} from '../../../util/List';

import {Token} from '../../../frontend/Token';
import {TokenType} from '../../../frontend/TokenType';

import {SymTabEntry} from '../../../intermediate/SymTabEntry';
import {ICodeNode} from '../../../intermediate/ICodeNode';
import {ICodeFactory} from '../../../intermediate/ICodeFactory';

import {ICodeNodeTypeImpl} from '../../../intermediate/icodeimpl/ICodeNodeTypeImpl';

export class BlockParser extends PascalParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParser) {
        super(parent);
    }

    /**
     * Parse a block.
     * @param token the initial token.
     * @param routineId the symbol table entry of the routine name.
     * @return the root node of the parse tree.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token, routineId : SymTabEntry) : ICodeNode{
        let declarationsParser : DeclarationsParser = new DeclarationsParser(this);
        let statementParser : StatementParser = new StatementParser(this);

        // Parse any declarations.
        declarationsParser.parse(token, routineId);

        token = this.synchronize(StatementParser.STMT_START_SET);
        let tokenType : TokenType = token.getType();
        let rootNode : ICodeNode = undefined;

        // Look for the BEGIN token to parse a compound statement.
        if (tokenType === PascalTokenType.BEGIN) {
            rootNode = statementParser.parse(token);
        }

        // Missing BEGIN: Attempt to parse anyway if possible.
        else {
            BlockParser.errorHandler.flag(token, PascalErrorCode.MISSING_BEGIN, this);

            if (StatementParser.STMT_START_SET.contains(tokenType as PascalTokenType)) {
                rootNode = ICodeFactory.createICodeNode(ICodeNodeTypeImpl.COMPOUND);
                statementParser.parseList(token, rootNode, PascalTokenType.END, PascalErrorCode.MISSING_END);
            }
        }

        return rootNode;
    }
}
