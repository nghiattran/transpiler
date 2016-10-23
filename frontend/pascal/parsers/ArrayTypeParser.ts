import {TypeSpecificationParser} from './TypeSpecificationParser';
import {SimpleTypeParser} from './SimpleTypeParser';

import {PascalParserTD} from '../PascalParserTD';
import {PascalTokenType} from '../PascalTokenType';
import {PascalErrorCode} from '../PascalErrorCode';

import {Token} from '../../Token';
import {Parser} from '../../Parser';
import {Source} from '../../Source';
import {TokenType} from '../../TokenType';

import {TypeForm} from '../../../intermediate/TypeForm';

import {TypeSpec} from '../../../intermediate/TypeSpec';
import {TypeFactory} from '../../../intermediate/TypeFactory';
import {TypeFormImpl} from '../../../intermediate/typeimpl/TypeFormImpl';
import {TypeKeyImpl} from '../../../intermediate/typeimpl/TypeKeyImpl';

import {List} from '../../../util/List';

export class ArrayTypeParser extends TypeSpecificationParser {
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    constructor(parent : PascalParserTD) {
        super(parent);
    }

    // Synchronization set for the [ token.
    private static LEFT_BRACKET_SET : List=
        SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();

    // Synchronization set for the ] token.
    private static RIGHT_BRACKET_SET : List =
        new List([
            PascalTokenType.RIGHT_BRACKET, 
            PascalTokenType.OF, 
            PascalTokenType.SEMICOLON]);

    // Synchronization set for OF.
    private static OF_SET : List =
        TypeSpecificationParser.TYPE_START_SET.clone();

    // Synchronization set to start an index type.
    private static INDEX_START_SET : List =
        SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();
    

    // Synchronization set to end an index type.
    private static INDEX_END_SET : List =
        new List([
            PascalTokenType.RIGHT_BRACKET, 
            PascalTokenType.OF, 
            PascalTokenType.SEMICOLON]);

    // Synchronization set to follow an index type.
    private static INDEX_FOLLOW_SET : List =
        ArrayTypeParser.INDEX_START_SET.clone();
    
    static initialize() : void {
        ArrayTypeParser.LEFT_BRACKET_SET.add(PascalTokenType.LEFT_BRACKET);
        ArrayTypeParser.LEFT_BRACKET_SET.add(PascalTokenType.RIGHT_BRACKET);

        ArrayTypeParser.OF_SET.add(PascalTokenType.OF);
        ArrayTypeParser.OF_SET.add(PascalTokenType.SEMICOLON);

        ArrayTypeParser.INDEX_START_SET.add(PascalTokenType.COMMA);

        ArrayTypeParser.INDEX_FOLLOW_SET.addAll(ArrayTypeParser.INDEX_END_SET);
    }

    /**
     * Parse a Pascal array type specification.
     * @param token the current token.
     * @return the array type specification.
     * @throws Exception if an error occurred.
     */
    public parse(token : Token) : any {
        let arrayType : TypeSpec = TypeFactory.createType(PascalTokenType.ARRAY);
        token = this.nextToken();  // consume ARRAY

        // Synchronize at the [ token.
        token = this.synchronize(ArrayTypeParser.LEFT_BRACKET_SET);
        if (token.getType() != PascalTokenType.LEFT_BRACKET) {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_LEFT_BRACKET, this);
        }

        // Parse the list of index types.
        let elementType : TypeSpec = this.parseIndexTypeList(token, arrayType);

        // Synchronize at the ] token.
        token = this.synchronize(ArrayTypeParser.RIGHT_BRACKET_SET);
        if (token.getType() == PascalTokenType.RIGHT_BRACKET) {
            token = this.nextToken();  // consume [
        }
        else {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_RIGHT_BRACKET, this);
        }

        // Synchronize at OF.
        token = this.synchronize(ArrayTypeParser.OF_SET);
        if (token.getType() == PascalTokenType.OF) {
            token = this.nextToken();  // consume OF
        }
        else {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_OF, this);
        }

        // Parse the element type.
        elementType.setAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE, this.parseElementType(token));

        return arrayType;
    }

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
            token = this.synchronize(ArrayTypeParser.INDEX_START_SET);
            this.parseIndexType(token, elementType);

            // Synchronize at the , token.
            token = this.synchronize(ArrayTypeParser.INDEX_FOLLOW_SET);
            let tokenType : TokenType = token.getType();
            if ((tokenType != PascalTokenType.COMMA) && (tokenType != PascalTokenType.RIGHT_BRACKET)) {
                if (ArrayTypeParser.INDEX_START_SET.contains(tokenType)) {
                    ArrayTypeParser.errorHandler.flag(token, PascalErrorCode.MISSING_COMMA, this);
                    anotherIndex = true;
                }
            }

            // Create an ARRAY element type object
            // for each subsequent index type.
            else if (tokenType == PascalTokenType.COMMA) {
                let newElementType : TypeSpec = TypeFactory.createType(PascalTokenType.ARRAY);
                elementType.setAttribute(TypeKeyImpl.ARRAY_ELEMENT_TYPE, newElementType);
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
        arrayType.setAttribute(TypeKeyImpl.ARRAY_INDEX_TYPE, indexType);

        if (indexType == null) {
            return;
        }

        let form : TypeForm = indexType.getForm();
        let count : number = 0;

        // Check the index type and set the element count.
        if (form == TypeFormImpl.SUBRANGE) {
            let minValue : number =
                <number> indexType.getAttribute(TypeKeyImpl.SUBRANGE_MIN_VALUE);

            let maxValue : number =
                <number> indexType.getAttribute(TypeKeyImpl.SUBRANGE_MAX_VALUE);

            if ((minValue != null) && (maxValue != null)) {
                count = maxValue - minValue + 1;
            }
        }
        else if (form == TypeFormImpl.ENUMERATION) {
            let constants : List = <List>
                indexType.getAttribute(TypeKeyImpl.ENUMERATION_CONSTANTS);
            count = constants.size();
        }
        else {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode.INVALID_INDEX_TYPE, this);
        }
        arrayType.setAttribute(TypeKeyImpl.ARRAY_ELEMENT_COUNT, count);
    }

    /**
     * Parse the element type specification.
     * @param token the current token.
     * @return the element type specification.
     * @throws Exception if an error occurred.
     */
    private parseElementType(token : Token) : TypeSpec{
        let typeSpecificationParser : TypeSpecificationParser =
            new TypeSpecificationParser(this);
        return typeSpecificationParser.parse(token);
    }
}

export module ArrayTypeParser {
    ArrayTypeParser.initialize();
}