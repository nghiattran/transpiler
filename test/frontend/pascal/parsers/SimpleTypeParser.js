"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeSpecificationParser_1 = require('./TypeSpecificationParser');
var ConstantDefinitionsParser_1 = require('./ConstantDefinitionsParser');
var SubrangeTypeParser_1 = require('./SubrangeTypeParser');
var EnumerationTypeParser_1 = require('./EnumerationTypeParser');
var PascalTokenType_1 = require('../PascalTokenType');
var PascalErrorCode_1 = require('../PascalErrorCode');
var DefinitionImpl_1 = require('../../../intermediate/symtabimpl/DefinitionImpl');
var SimpleTypeParser = (function (_super) {
    __extends(SimpleTypeParser, _super);
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    function SimpleTypeParser(parent) {
        _super.call(this, parent);
    }
    SimpleTypeParser.initialize = function () {
        SimpleTypeParser.SIMPLE_TYPE_START_SET.add(PascalTokenType_1.PascalTokenType.LEFT_PAREN);
        SimpleTypeParser.SIMPLE_TYPE_START_SET.add(PascalTokenType_1.PascalTokenType.COMMA);
        SimpleTypeParser.SIMPLE_TYPE_START_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
    };
    /**
     * Parse a simple Pascal type specification.
     * @param token the current token.
     * @return the simple type specification.
     * @throws Exception if an error occurred.
     */
    SimpleTypeParser.prototype.parse = function (token) {
        // Synchronize at the start of a simple type specification.
        token = this.synchronize(SimpleTypeParser.SIMPLE_TYPE_START_SET);
        switch (token.getType()) {
            case PascalTokenType_1.PascalTokenType.IDENTIFIER: {
                var name_1 = token.getText().toLowerCase();
                var id = SimpleTypeParser.symTabStack.lookup(name_1);
                if (id != null) {
                    var definition = id.getDefinition();
                    // It's either a type identifier
                    // or the start of a subrange type.
                    if (definition == DefinitionImpl_1.DefinitionImpl.TYPE) {
                        id.appendLineNumber(token.getLineNumber());
                        token = this.nextToken(); // consume the identifier
                        // Return the type of the referent type.
                        return id.getTypeSpec();
                    }
                    else if ((definition != DefinitionImpl_1.DefinitionImpl.CONSTANT) &&
                        (definition != DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT)) {
                        SimpleTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.NOT_TYPE_IDENTIFIER, this);
                        token = this.nextToken(); // consume the identifier
                        return null;
                    }
                    else {
                        var subrangeTypeParser = new SubrangeTypeParser_1.SubrangeTypeParser(this);
                        return subrangeTypeParser.parse(token);
                    }
                }
                else {
                    SimpleTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.IDENTIFIER_UNDEFINED, this);
                    token = this.nextToken(); // consume the identifier
                    return null;
                }
            }
            case PascalTokenType_1.PascalTokenType.LEFT_PAREN: {
                var enumerationTypeParser = new EnumerationTypeParser_1.EnumerationTypeParser(this);
                return enumerationTypeParser.parse(token);
            }
            case PascalTokenType_1.PascalTokenType.COMMA:
            case PascalTokenType_1.PascalTokenType.SEMICOLON: {
                SimpleTypeParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_TYPE, this);
                return null;
            }
            default: {
                var subrangeTypeParser = new SubrangeTypeParser_1.SubrangeTypeParser(this);
                return subrangeTypeParser.parse(token);
            }
        }
    };
    // Synchronization set for starting a simple type specification.
    SimpleTypeParser.SIMPLE_TYPE_START_SET = ConstantDefinitionsParser_1.ConstantDefinitionsParser.CONSTANT_START_SET.clone();
    return SimpleTypeParser;
}(TypeSpecificationParser_1.TypeSpecificationParser));
exports.SimpleTypeParser = SimpleTypeParser;
var SimpleTypeParser;
(function (SimpleTypeParser) {
    SimpleTypeParser.initialize();
})(SimpleTypeParser = exports.SimpleTypeParser || (exports.SimpleTypeParser = {}));
