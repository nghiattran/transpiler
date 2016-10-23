"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeSpecificationParser_1 = require('./TypeSpecificationParser');
var SimpleTypeParser_1 = require('./SimpleTypeParser');
var PascalTokenType_1 = require('../PascalTokenType');
var PascalErrorCode_1 = require('../PascalErrorCode');
var TypeFactory_1 = require('../../../intermediate/TypeFactory');
var TypeFormImpl_1 = require('../../../intermediate/typeimpl/TypeFormImpl');
var TypeKeyImpl_1 = require('../../../intermediate/typeimpl/TypeKeyImpl');
var List_1 = require('../../../util/List');
var ArrayTypeParser = (function (_super) {
    __extends(ArrayTypeParser, _super);
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    function ArrayTypeParser(parent) {
        _super.call(this, parent);
    }
    ArrayTypeParser.initialize = function () {
        ArrayTypeParser.LEFT_BRACKET_SET.add(PascalTokenType_1.PascalTokenType.LEFT_BRACKET);
        ArrayTypeParser.LEFT_BRACKET_SET.add(PascalTokenType_1.PascalTokenType.RIGHT_BRACKET);
        ArrayTypeParser.OF_SET.add(PascalTokenType_1.PascalTokenType.OF);
        ArrayTypeParser.OF_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
        ArrayTypeParser.INDEX_START_SET.add(PascalTokenType_1.PascalTokenType.COMMA);
        ArrayTypeParser.INDEX_FOLLOW_SET.addAll(ArrayTypeParser.INDEX_END_SET);
    };
    /**
     * Parse a Pascal array type specification.
     * @param token the current token.
     * @return the array type specification.
     * @throws Exception if an error occurred.
     */
    ArrayTypeParser.prototype.parse = function (token) {
        var arrayType = TypeFactory_1.TypeFactory.createType(PascalTokenType_1.PascalTokenType.ARRAY);
        token = this.nextToken(); // consume ARRAY
        // Synchronize at the [ token.
        token = this.synchronize(ArrayTypeParser.LEFT_BRACKET_SET);
        if (token.getType() != PascalTokenType_1.PascalTokenType.LEFT_BRACKET) {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_LEFT_BRACKET, this);
        }
        // Parse the list of index types.
        var elementType = this.parseIndexTypeList(token, arrayType);
        // Synchronize at the ] token.
        token = this.synchronize(ArrayTypeParser.RIGHT_BRACKET_SET);
        if (token.getType() == PascalTokenType_1.PascalTokenType.RIGHT_BRACKET) {
            token = this.nextToken(); // consume [
        }
        else {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_RIGHT_BRACKET, this);
        }
        // Synchronize at OF.
        token = this.synchronize(ArrayTypeParser.OF_SET);
        if (token.getType() == PascalTokenType_1.PascalTokenType.OF) {
            token = this.nextToken(); // consume OF
        }
        else {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_OF, this);
        }
        // Parse the element type.
        elementType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_ELEMENT_TYPE, this.parseElementType(token));
        return arrayType;
    };
    /**
     * Parse the list of index type specifications.
     * @param token the current token.
     * @param arrayType the current array type specification.
     * @return the element type specification.
     * @throws Exception if an error occurred.
     */
    ArrayTypeParser.prototype.parseIndexTypeList = function (token, arrayType) {
        var elementType = arrayType;
        var anotherIndex = false;
        token = this.nextToken(); // consume the [ token
        // Parse the list of index type specifications.
        do {
            anotherIndex = false;
            // Parse the index type.
            token = this.synchronize(ArrayTypeParser.INDEX_START_SET);
            this.parseIndexType(token, elementType);
            // Synchronize at the , token.
            token = this.synchronize(ArrayTypeParser.INDEX_FOLLOW_SET);
            var tokenType = token.getType();
            if ((tokenType != PascalTokenType_1.PascalTokenType.COMMA) && (tokenType != PascalTokenType_1.PascalTokenType.RIGHT_BRACKET)) {
                if (ArrayTypeParser.INDEX_START_SET.contains(tokenType)) {
                    ArrayTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_COMMA, this);
                    anotherIndex = true;
                }
            }
            else if (tokenType == PascalTokenType_1.PascalTokenType.COMMA) {
                var newElementType = TypeFactory_1.TypeFactory.createType(PascalTokenType_1.PascalTokenType.ARRAY);
                elementType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_ELEMENT_TYPE, newElementType);
                elementType = newElementType;
                token = this.nextToken(); // consume the , token
                anotherIndex = true;
            }
        } while (anotherIndex);
        return elementType;
    };
    /**
     * Parse an index type specification.
     * @param token the current token.
     * @param arrayType the current array type specification.
     * @throws Exception if an error occurred.
     */
    ArrayTypeParser.prototype.parseIndexType = function (token, arrayType) {
        var simpleTypeParser = new SimpleTypeParser_1.SimpleTypeParser(this);
        var indexType = simpleTypeParser.parse(token);
        arrayType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_INDEX_TYPE, indexType);
        if (indexType == null) {
            return;
        }
        var form = indexType.getForm();
        var count = 0;
        // Check the index type and set the element count.
        if (form == TypeFormImpl_1.TypeFormImpl.SUBRANGE) {
            var minValue = indexType.getAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_MIN_VALUE);
            var maxValue = indexType.getAttribute(TypeKeyImpl_1.TypeKeyImpl.SUBRANGE_MAX_VALUE);
            if ((minValue != null) && (maxValue != null)) {
                count = maxValue - minValue + 1;
            }
        }
        else if (form == TypeFormImpl_1.TypeFormImpl.ENUMERATION) {
            var constants = indexType.getAttribute(TypeKeyImpl_1.TypeKeyImpl.ENUMERATION_CONSTANTS);
            count = constants.size();
        }
        else {
            ArrayTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_INDEX_TYPE, this);
        }
        arrayType.setAttribute(TypeKeyImpl_1.TypeKeyImpl.ARRAY_ELEMENT_COUNT, count);
    };
    /**
     * Parse the element type specification.
     * @param token the current token.
     * @return the element type specification.
     * @throws Exception if an error occurred.
     */
    ArrayTypeParser.prototype.parseElementType = function (token) {
        var typeSpecificationParser = new TypeSpecificationParser_1.TypeSpecificationParser(this);
        return typeSpecificationParser.parse(token);
    };
    // Synchronization set for the [ token.
    ArrayTypeParser.LEFT_BRACKET_SET = SimpleTypeParser_1.SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();
    // Synchronization set for the ] token.
    ArrayTypeParser.RIGHT_BRACKET_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.RIGHT_BRACKET,
        PascalTokenType_1.PascalTokenType.OF,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    // Synchronization set for OF.
    ArrayTypeParser.OF_SET = TypeSpecificationParser_1.TypeSpecificationParser.TYPE_START_SET.clone();
    // Synchronization set to start an index type.
    ArrayTypeParser.INDEX_START_SET = SimpleTypeParser_1.SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();
    // Synchronization set to end an index type.
    ArrayTypeParser.INDEX_END_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.RIGHT_BRACKET,
        PascalTokenType_1.PascalTokenType.OF,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    // Synchronization set to follow an index type.
    ArrayTypeParser.INDEX_FOLLOW_SET = ArrayTypeParser.INDEX_START_SET.clone();
    return ArrayTypeParser;
}(TypeSpecificationParser_1.TypeSpecificationParser));
exports.ArrayTypeParser = ArrayTypeParser;
var ArrayTypeParser;
(function (ArrayTypeParser) {
    ArrayTypeParser.initialize();
})(ArrayTypeParser = exports.ArrayTypeParser || (exports.ArrayTypeParser = {}));
