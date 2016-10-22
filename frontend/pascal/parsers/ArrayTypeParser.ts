import {PascalParserTD} from '../PascalParserTD';

import {Token} from '../../Token';
import {Parser} from '../../Parser';
import {Source} from '../../Source';

import {TypeSpec} from '../../../intermediate/TypeSpec';
import {TypeFactory} from '../../../intermediate/TypeFactory';

export class ArrayTypeParser extends TypeSpecificationParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    protected constructor(parent : PascalParserTD) {
        super(parent);
    }

    // Synchronization set for the [ token.
    // private static final EnumSet<PascalTokenType> LEFT_BRACKET_SET =
    //     SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();
    // static {
    //     LEFT_BRACKET_SET.add(LEFT_BRACKET);
    //     LEFT_BRACKET_SET.add(RIGHT_BRACKET);
    // }

    // // Synchronization set for the ] token.
    // private static final EnumSet<PascalTokenType> RIGHT_BRACKET_SET =
    //     EnumSet.of(RIGHT_BRACKET, OF, SEMICOLON);

    // // Synchronization set for OF.
    // private static final EnumSet<PascalTokenType> OF_SET =
    //     TypeSpecificationParser.TYPE_START_SET.clone();
    // static {
    //     OF_SET.add(OF);
    //     OF_SET.add(SEMICOLON);
    // }

    /**
     * Parse a Pascal array type specification.
     * @param token the current token.
     * @return the array type specification.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : TypeSpec {
        let arrayType : TypeSpec = TypeFactory.createType(ARRAY);
        token = this.nextToken();  // consume ARRAY

        // Synchronize at the [ token.
        token = this.synchronize(LEFT_BRACKET_SET);
        if (token.getType() != LEFT_BRACKET) {
            this.errorHandler.flag(token, MISSING_LEFT_BRACKET, this);
        }

        // Parse the list of index types.
        let elementType : TypeSpec = this.parseIndexTypeList(token, arrayType);

        // Synchronize at the ] token.
        token = this.synchronize(RIGHT_BRACKET_SET);
        if (token.getType() == RIGHT_BRACKET) {
            token = this.nextToken();  // consume [
        }
        else {
            this.errorHandler.flag(token, MISSING_RIGHT_BRACKET, this);
        }

        // Synchronize at OF.
        token = this.synchronize(OF_SET);
        if (token.getType() == OF) {
            token = this.nextToken();  // consume OF
        }
        else {
            this.errorHandler.flag(token, MISSING_OF, this);
        }

        // Parse the element type.
        elementType.setAttribute(ARRAY_ELEMENT_TYPE, this.parseElementType(token));

        return arrayType;
    }

    // // Synchronization set to start an index type.
    // private static final EnumSet<PascalTokenType> INDEX_START_SET =
    //     SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();
    // static {
    //     INDEX_START_SET.add(COMMA);
    // }

    // // Synchronization set to end an index type.
    // private static final EnumSet<PascalTokenType> INDEX_END_SET =
    //     EnumSet.of(RIGHT_BRACKET, OF, SEMICOLON);

    // // Synchronization set to follow an index type.
    // private static final EnumSet<PascalTokenType> INDEX_FOLLOW_SET =
    //     INDEX_START_SET.clone();
    // static {
    //     INDEX_FOLLOW_SET.addAll(INDEX_END_SET);
    // }

    /**
     * Parse the list of index type specifications.
     * @param token the current token.
     * @param arrayType the current array type specification.
     * @return the element type specification.
     * @throws Exception if an error occurred.
     */
    private parseIndexTypeList(token : Token, arrayType : TypeSpec) : TypeSpec {
        let elementType : TypeSpec = arrayType;
        let anotherIndex : boolean = false;

        token = this.nextToken();  // consume the [ token

        // Parse the list of index type specifications.
        do {
            anotherIndex = false;

            // Parse the index type.
            token = this.synchronize(INDEX_START_SET);
            this.parseIndexType(token, elementType);

            // Synchronize at the , token.
            token = this.synchronize(INDEX_FOLLOW_SET);
            let tokenType : TokenType = token.getType();
            if ((tokenType != COMMA) && (tokenType != RIGHT_BRACKET)) {
                if (INDEX_START_SET.contains(tokenType)) {
                    this.errorHandler.flag(token, MISSING_COMMA, this);
                    anotherIndex = true;
                }
            }

            // Create an ARRAY element type object
            // for each subsequent index type.
            else if (tokenType == COMMA) {
                let newElementType : TypeSpec = TypeFactory.createType(ARRAY);
                elementType.setAttribute(ARRAY_ELEMENT_TYPE, newElementType);
                elementType = newElementType;

                token = this.nextToken();  // consume the , token
                anotherIndex = true;
            }
        } while (anotherIndex);

        return elementType;
    }

    /**
     * Parse an index type specification.
     * @param token the current token.
     * @param arrayType the current array type specification.
     * @throws Exception if an error occurred.
     */
    private parseIndexType(token : Token, arrayType : TypeSpec) : void{
        let simpleTypeParser : SimpleTypeParser = new SimpleTypeParser(this);
        let indexType : TypeSpec = simpleTypeParser.parse(token);
        arrayType.setAttribute(ARRAY_INDEX_TYPE, indexType);

        if (indexType == null) {
            return;
        }

        let form : TypeForm = indexType.getForm();
        let count : number = 0;

        // Check the index type and set the element count.
        if (form == SUBRANGE) {
            let minValue : number =
                <number> indexType.getAttribute(SUBRANGE_MIN_VALUE);

            let maxValue : number =
                <number> indexType.getAttribute(SUBRANGE_MAX_VALUE);

            if ((minValue != null) && (maxValue != null)) {
                count = maxValue - minValue + 1;
            }
        }
        else if (form == ENUMERATION) {
            let constants : List = <List>
                indexType.getAttribute(ENUMERATION_CONSTANTS);
            count = constants.size();
        }
        else {
            this.errorHandler.flag(token, INVALID_INDEX_TYPE, this);
        }
        arrayType.setAttribute(ARRAY_ELEMENT_COUNT, count);
    }

    /**
     * Parse the element type specification.
     * @param token the current token.
     * @return the element type specification.
     * @throws Exception if an error occurred.
     */
    private parseElementType(token : Token) TypeSpec{
        let typeSpecificationParser : TypeSpecificationParser =
            new TypeSpecificationParser(this);
        return typeSpecificationParser.parse(token);
    }
}
