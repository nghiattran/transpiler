import {PascalParser} from '../PascalParser';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {Token} from '../../Token';
import {TokenType} from '../../TokenType';

import {Definition} from '../../../intermediate/Definition';
import {TypeSpec} from '../../../intermediate/TypeSpec';
import {SymTabEntry} from '../../../intermediate/SymTabEntry';
import {TypeFactory} from '../../../intermediate/TypeFactory';

import {DefinitionImpl} from '../../../intermediate/symtabimpl/DefinitionImpl';
import {Predefined} from '../../../intermediate/symtabimpl/Predefined';
import {SymTabKeyImpl} from '../../../intermediate/symtabimpl/SymTabKeyImpl';

import {TypeKeyImpl} from '../../../intermediate/typeimpl/TypeKeyImpl';
import {TypeFormImpl} from '../../../intermediate/typeimpl/TypeFormImpl';

import {List} from '../../../util/List';

import {VariableDeclarationsParser} from './VariableDeclarationsParser';
import {TypeSpecificationParser} from './TypeSpecificationParser';
import {DeclarationsParser} from './DeclarationsParser';

export class RecordTypeParser extends TypeSpecificationParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for the END.
    private static END_SET : List<PascalTokenType> =
        DeclarationsParser.VAR_START_SET.clone();

    static initialize() : void {
        RecordTypeParser.END_SET.add(PascalTokenType.END);
        RecordTypeParser.END_SET.add(PascalTokenType.SEMICOLON);
    }

    /**
     * Parse a Pascal record type specification.
     * @param token the current token.
     * @return the record type specification.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) :TypeSpec {
        let recordType : TypeSpec = TypeFactory.createType(PascalTokenType.RECORD);
        token = this.nextToken();  // consume RECORD

        // Push a symbol table for the RECORD type specification.
        recordType.setAttribute(TypeKeyImpl.RECORD_SYMTAB, RecordTypeParser.symTabStack.push());

        // Parse the field declarations.
        let variableDeclarationsParser : VariableDeclarationsParser =
            new VariableDeclarationsParser(this);
        variableDeclarationsParser.setDefinition(DefinitionImpl.FIELD);
        variableDeclarationsParser.parse(token, undefined);

        // Pop off the record's symbol table.
        RecordTypeParser.symTabStack.pop();

        // Synchronize at the END.
        token = this.synchronize(RecordTypeParser.END_SET);

        // Look for the END.
        if (token.getType() === PascalTokenType.END) {
            token = this.nextToken();  // consume END
        }
        else {
            RecordTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_END, this);
        }

        return recordType;
    }
}

export module RecordTypeParser {
    RecordTypeParser.initialize();
}