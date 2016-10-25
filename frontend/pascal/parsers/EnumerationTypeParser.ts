import {PascalParserTD} from '../PascalParserTD';
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
import {Util} from '../../../util/Util';

import {DeclarationsParser} from './DeclarationsParser';
import {ConstantDefinitionsParser} from './ConstantDefinitionsParser';
import {TypeSpecificationParser} from './TypeSpecificationParser';

export class EnumerationTypeParser extends TypeSpecificationParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    constructor(parent : PascalParserTD) {
        super(parent);
    }

    // Synchronization set to start an enumeration constant.
    private static ENUM_CONSTANT_START_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.IDENTIFIER, 
            PascalTokenType.COMMA]);

    // Synchronization set to follow an enumeration definition.
    private static ENUM_DEFINITION_FOLLOW_SET : List<PascalTokenType> =
        new List<PascalTokenType>([
            PascalTokenType.RIGHT_PAREN, 
            PascalTokenType.SEMICOLON]);

    static initialize(): void {
        EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET.addAll(DeclarationsParser.VAR_START_SET);
    }

    /**
     * Parse a Pascal enumeration type specification.
     * @param token the current token.
     * @return the enumeration type specification.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : TypeSpec{
        let enumerationType : TypeSpec = TypeFactory.createType(TypeFormImpl.ENUMERATION);
        let value : number = -1;
        let constants : List<SymTabEntry> = new List<SymTabEntry>();

        token = this.nextToken();  // consume the opening (

        do {
            token = this.synchronize(EnumerationTypeParser.ENUM_CONSTANT_START_SET);
            this.parseEnumerationIdentifier(token, ++value, enumerationType,
                                       constants);

            token = this.currentToken();
            let tokenType : TokenType = token.getType();

            // Look for the comma.
            if (tokenType == PascalTokenType.COMMA) {
                token = this.nextToken();  // consume the comma

                if (EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET.contains(token.getType() as PascalTokenType)) {
                    EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_IDENTIFIER, this);
                }
            }
            else if (EnumerationTypeParser.ENUM_CONSTANT_START_SET.contains(tokenType as PascalTokenType)) {
                EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_COMMA, this);
            }
        } while (!EnumerationTypeParser.ENUM_DEFINITION_FOLLOW_SET.contains(token.getType() as PascalTokenType));

        // Look for the closing ).
        if (token.getType() == PascalTokenType.RIGHT_PAREN) {
            token = this.nextToken();  // consume the )
        }
        else {
            EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_RIGHT_PAREN, this);
        }

        enumerationType.setAttribute(TypeKeyImpl.ENUMERATION_CONSTANTS, constants);
        return enumerationType;
    }

    /**
     * Parse an enumeration identifier.
     * @param token the current token.
     * @param value the identifier's integer value (sequence number).
     * @param enumerationType the enumeration type specification.
     * @param constants the array of symbol table entries for the
     * enumeration constants.
     * @throws Exception if an error occurred.
     */
    private parseEnumerationIdentifier(token : Token, value : number,
                                       enumerationType : TypeSpec,
                                       constants : List<SymTabEntry> )
        : void
    {
        let tokenType : TokenType = token.getType();

        if (tokenType == PascalTokenType.IDENTIFIER) {
            let name : string = token.getText().toLowerCase();
            let constantId : SymTabEntry = EnumerationTypeParser.symTabStack.lookupLocal(name);

            if (constantId != null) {
                EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_REDEFINED, this);
            }
            else {
                constantId = EnumerationTypeParser.symTabStack.enterLocal(name);
                constantId.setDefinition(DefinitionImpl.ENUMERATION_CONSTANT);
                constantId.setTypeSpec(enumerationType);
                constantId.setAttribute(SymTabKeyImpl.CONSTANT_VALUE, value);
                constantId.appendLineNumber(token.getLineNumber());
                constants.add(constantId);
            }

            token = this.nextToken();  // consume the identifier
        }
        else {
            EnumerationTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_IDENTIFIER, this);
        }
    }
}

export module EnumerationTypeParser {
    EnumerationTypeParser.initialize();
}