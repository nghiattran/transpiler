import {TypeSpecificationParser} from './TypeSpecificationParser';
import {ConstantDefinitionsParser} from './ConstantDefinitionsParser';
import {SubrangeTypeParser} from './SubrangeTypeParser';
import {EnumerationTypeParser} from './EnumerationTypeParser';

import {PascalParser} from '../PascalParser';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {Token} from '../../../frontend/Token';

import {Definition} from '../../../intermediate/Definition';
import {SymTabEntry} from '../../../intermediate/SymTabEntry';

import {TypeSpec} from '../../../intermediate/TypeSpec';

import {DefinitionImpl} from '../../../intermediate/symtabimpl/DefinitionImpl';

import {List} from '../../../util/List';

export class SimpleTypeParser extends PascalParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    constructor(parent : PascalParser) {
        super(parent);
    }

    // Synchronization set for starting a simple type specification.
    static SIMPLE_TYPE_START_SET : List<PascalTokenType> =
        ConstantDefinitionsParser.CONSTANT_START_SET.clone();

    static initialize() : void {
        SimpleTypeParser.SIMPLE_TYPE_START_SET.add(PascalTokenType.LEFT_PAREN);
        SimpleTypeParser.SIMPLE_TYPE_START_SET.add(PascalTokenType.COMMA);
        SimpleTypeParser.SIMPLE_TYPE_START_SET.add(PascalTokenType.SEMICOLON);
    }

    /**
     * Parse a simple Pascal type specification.
     * @param token the current token.
     * @return the simple type specification.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : TypeSpec{
        // Synchronize at the start of a simple type specification.
        token = this.synchronize(SimpleTypeParser.SIMPLE_TYPE_START_SET);

        switch (<PascalTokenType> token.getType()) {

            case PascalTokenType.IDENTIFIER: {
                let name : string = token.getText().toLowerCase();
                let id : SymTabEntry = SimpleTypeParser.symTabStack.lookup(name);

                if (id !== undefined) {
                    let definition : Definition = id.getDefinition();

                    // It's either a type identifier
                    // or the start of a subrange type.
                    if (definition === DefinitionImpl.TYPE) {
                        id.appendLineNumber(token.getLineNumber());
                        token = this.nextToken();  // consume the identifier

                        // Return the type of the referent type.
                        return id.getTypeSpec();
                    }
                    else if ((definition !== DefinitionImpl.CONSTANT) &&
                             (definition !== DefinitionImpl.ENUMERATION_CONSTANT)) {
                        SimpleTypeParser.errorHandler.flag(token, PascalErrorCode.NOT_TYPE_IDENTIFIER, this);
                        token = this.nextToken();  // consume the identifier
                        return undefined;
                    }
                    else {
                        let subrangeTypeParser : SubrangeTypeParser =
                            new SubrangeTypeParser(this);
                        return subrangeTypeParser.parse(token);
                    }
                }
                else {
                    SimpleTypeParser.errorHandler.flag(token, PascalErrorCode.IDENTIFIER_UNDEFINED, this);
                    token = this.nextToken();  // consume the identifier
                    return undefined;
                }
            }

            case PascalTokenType.LEFT_PAREN: {
                let enumerationTypeParser : EnumerationTypeParser =
                    new EnumerationTypeParser(this);
                return enumerationTypeParser.parse(token);
            }

            case PascalTokenType.COMMA:
            case PascalTokenType.SEMICOLON: {
                SimpleTypeParser.errorHandler.flag(token, PascalErrorCode.INVALID_TYPE, this);
                return undefined;
            }

            default: {
                let subrangeTypeParser : SubrangeTypeParser =
                    new SubrangeTypeParser(this);
                return subrangeTypeParser.parse(token);
            }
        }
    }
}

SimpleTypeParser.initialize();