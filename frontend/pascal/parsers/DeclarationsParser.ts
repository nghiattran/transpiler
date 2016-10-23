import {PascalParserTD} from '../PascalParserTD';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {ConstantDefinitionsParser} from './ConstantDefinitionsParser';
import {TypeDefinitionsParser} from './TypeDefinitionsParser';
import {DeclaredRoutineParser} from './DeclaredRoutineParser';

import {Token} from '../../Token';
import {TokenType} from '../../TokenType';

import {Definition} from '../../../intermediate/Definition';
import {SymTabEntry} from '../../../intermediate/SymTabEntry';

import {TypeSpec} from '../../../intermediate/TypeSpec';

import {DefinitionImpl} from '../../../intermediate/symtabimpl/DefinitionImpl';

import {List} from '../../../util/List';

export class DeclarationsParser extends PascalParserTD {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    public constructor(parent : PascalParserTD) {
        super(parent);
    }

    static DECLARATION_START_SET : List =
        new List([
            PascalTokenType.CONST, 
            PascalTokenType.TYPE, 
            PascalTokenType.VAR, 
            PascalTokenType.PROCEDURE, 
            PascalTokenType.FUNCTION, 
            PascalTokenType.BEGIN]);
    static TYPE_START_SET =
        DeclarationsParser.DECLARATION_START_SET.clone();
    static VAR_START_SET =
        DeclarationsParser.TYPE_START_SET.clone();
    static ROUTINE_START_SET =
        DeclarationsParser.VAR_START_SET.clone();

    static initialize() : void {
        DeclarationsParser.TYPE_START_SET.remove(PascalTokenType.CONST);
        DeclarationsParser.VAR_START_SET.remove(PascalTokenType.TYPE);
        DeclarationsParser.ROUTINE_START_SET.remove(PascalTokenType.VAR);
    }

    /**
     * Parse declarations.
     * To be overridden by the specialized declarations parser subclasses.
     * @param token the initial token.
     * @param parentId the symbol table entry of the parent routine's name.
     * @return null
     * @throws Exception if an error occurred.
     */
    public parse(token : Token, parentId : SymTabEntry) : SymTabEntry
    {
        token = this.synchronize(DeclarationsParser.DECLARATION_START_SET);

        if (token.getType() == PascalTokenType.CONST) {
            token = this.nextToken();  // consume CONST

            let constantDefinitionsParser : ConstantDefinitionsParser =
                new ConstantDefinitionsParser(this);
            constantDefinitionsParser.parse(token, null);
        }

        token = this.synchronize(DeclarationsParser.TYPE_START_SET);

        if (token.getType() == PascalTokenType.TYPE) {
            token = this.nextToken();  // consume TYPE

            let typeDefinitionsParser : TypeDefinitionsParser =
                new TypeDefinitionsParser(this);
            typeDefinitionsParser.parse(token, null);
        }

        token = this.synchronize(DeclarationsParser.VAR_START_SET);

        if (token.getType() == PascalTokenType.VAR) {
            token = this.nextToken();  // consume VAR

            let variableDeclarationsParser : VariableDeclarationsParser =
                new VariableDeclarationsParser(this);
            variableDeclarationsParser.setDefinition(DefinitionImpl.VARIABLE);
            variableDeclarationsParser.parse(token, null);
        }

        token = this.synchronize(DeclarationsParser.ROUTINE_START_SET);
        let tokenType : TokenType = token.getType();

        while ((tokenType == PascalTokenType.PROCEDURE) || (tokenType == DefinitionImpl.FUNCTION)) {
            let routineParser : DeclaredRoutineParser =
                new DeclaredRoutineParser(this);
            routineParser.parse(token, parentId);

            // Look for one or more semicolons after a definition.
            token = this.currentToken();
            if (token.getType() == PascalTokenType.SEMICOLON) {
                while (token.getType() == PascalTokenType.SEMICOLON) {
                    token = this.nextToken();  // consume the ;
                }
            }

            token = this.synchronize(DeclarationsParser.ROUTINE_START_SET);
            tokenType = token.getType();
        }

        return null;
    }
}

export module DeclarationsParser {
    DeclarationsParser.initialize();
}