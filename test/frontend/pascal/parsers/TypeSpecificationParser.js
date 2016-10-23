"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PascalParserTD_1 = require('../PascalParserTD');
var PascalTokenType_1 = require('../PascalTokenType');
var SimpleTypeParser_1 = require('./SimpleTypeParser');
var ArrayTypeParser_1 = require('./ArrayTypeParser');
var RecordTypeParser_1 = require('./RecordTypeParser');
var TypeSpecificationParser = (function (_super) {
    __extends(TypeSpecificationParser, _super);
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    function TypeSpecificationParser(parent) {
        _super.call(this, parent);
    }
    TypeSpecificationParser.initialize = function () {
        TypeSpecificationParser.TYPE_START_SET.add(PascalTokenType_1.PascalTokenType.ARRAY);
        TypeSpecificationParser.TYPE_START_SET.add(PascalTokenType_1.PascalTokenType.RECORD);
        TypeSpecificationParser.TYPE_START_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
    };
    /**
     * Parse a Pascal type specification.
     * @param token the current token.
     * @return the type specification.
     * @throws Exception if an error occurred.
     */
    TypeSpecificationParser.prototype.parse = function (token) {
        // Synchronize at the start of a type specification.
        token = this.synchronize(TypeSpecificationParser.TYPE_START_SET);
        switch (token.getType()) {
            case PascalTokenType_1.PascalTokenType.ARRAY: {
                var arrayTypeParser = new ArrayTypeParser_1.ArrayTypeParser(this);
                return arrayTypeParser.parse(token);
            }
            case PascalTokenType_1.PascalTokenType.RECORD: {
                var recordTypeParser = new RecordTypeParser_1.RecordTypeParser(this);
                return recordTypeParser.parse(token);
            }
            default: {
                var simpleTypeParser = new SimpleTypeParser_1.SimpleTypeParser(this);
                return simpleTypeParser.parse(token);
            }
        }
    };
    // Synchronization set for starting a type specification.
    // TODO
    TypeSpecificationParser.TYPE_START_SET = SimpleTypeParser_1.SimpleTypeParser.SIMPLE_TYPE_START_SET.clone();
    return TypeSpecificationParser;
}(PascalParserTD_1.PascalParserTD));
exports.TypeSpecificationParser = TypeSpecificationParser;
var TypeSpecificationParser;
(function (TypeSpecificationParser) {
    TypeSpecificationParser.initialize();
})(TypeSpecificationParser = exports.TypeSpecificationParser || (exports.TypeSpecificationParser = {}));
