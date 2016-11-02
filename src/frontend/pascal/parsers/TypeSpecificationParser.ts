import {PascalParserTD} from '../PascalParserTD';
import {PascalTokenType} from '../PascalTokenType';

import {Token} from '../../Token';

import {TypeSpec} from '../../../intermediate/TypeSpec';

import {List} from '../../../util/List';

import {SimpleTypeParser} from './SimpleTypeParser';
import {ArrayTypeParser} from './ArrayTypeParser';
import {RecordTypeParser} from './RecordTypeParser';

export class TypeSpecificationParser extends PascalParserTD {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    constructor(parent : PascalParserTD) {
        super(parent);
    }

    // Synchronization set for starting a type specification.
    // TODO
    static TYPE_START_SET : List<PascalTokenType> =
        SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();

    static initialize () : void {
        TypeSpecificationParser.TYPE_START_SET.add(PascalTokenType.ARRAY);
        TypeSpecificationParser.TYPE_START_SET.add(PascalTokenType.RECORD);
        TypeSpecificationParser.TYPE_START_SET.add(PascalTokenType.SEMICOLON);
    }

    /**
     * Parse a Pascal type specification.
     * @param token the current token.
     * @return the type specification.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : TypeSpec {
        // Synchronize at the start of a type specification.
        token = this.synchronize(TypeSpecificationParser.TYPE_START_SET);

        switch (<PascalTokenType> token.getType()) {

            case PascalTokenType.ARRAY: {
                let arrayTypeParser : ArrayTypeParser = new ArrayTypeParser(this);
                return arrayTypeParser.parse(token);
            }

            case PascalTokenType.RECORD: {
                let recordTypeParser : RecordTypeParser = new RecordTypeParser(this);
                return recordTypeParser.parse(token);
            }

            default: {
                let simpleTypeParser : SimpleTypeParser = new SimpleTypeParser(this);
                return simpleTypeParser.parse(token);
            }
        }
    }
}
TypeSpecificationParser.initialize();