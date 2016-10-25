"use strict";

var PascalTokenType_1 = require('../PascalTokenType');
var PascalErrorCode_1 = require('../PascalErrorCode');
var DeclarationsParser_1 = require('./DeclarationsParser');
var Token_1 = require('../../Token');
var TypeFactory_1 = require('../../../intermediate/TypeFactory');
var DefinitionImpl_1 = require('../../../intermediate/symtabimpl/DefinitionImpl');
var Predefined_1 = require('../../../intermediate/symtabimpl/Predefined');
var SymTabKeyImpl_1 = require('../../../intermediate/symtabimpl/SymTabKeyImpl');
var List_1 = require('../../../util/List');
var Util_1 = require('../../../util/Util');
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ConstantDefinitionsParser = (function (_super) {
    console.log(_super);
    __extends(ConstantDefinitionsParser, _super);
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    function ConstantDefinitionsParser(parent) {
        _super.call(this, parent);
    }
    ConstantDefinitionsParser.initialize = function () {
        ConstantDefinitionsParser.IDENTIFIER_SET.add(PascalTokenType_1.PascalTokenType.IDENTIFIER);
        ConstantDefinitionsParser.EQUALS_SET.add(PascalTokenType_1.PascalTokenType.EQUALS);
        ConstantDefinitionsParser.EQUALS_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
        ConstantDefinitionsParser.NEXT_START_SET.add(PascalTokenType_1.PascalTokenType.SEMICOLON);
        ConstantDefinitionsParser.NEXT_START_SET.add(PascalTokenType_1.PascalTokenType.IDENTIFIER);
    };
    /**
     * Parse constant definitions.
     * @param token the initial token.
     * @param parentId the symbol table entry of the parent routine's name.
     * @return null
     * @throws Exception if an error occurred.
     */
    ConstantDefinitionsParser.prototype.parse = function (token, parentId) {
        token = this.synchronize(ConstantDefinitionsParser.IDENTIFIER_SET);
        // Loop to parse a sequence of constant definitions
        // separated by semicolons.
        while (token.getType() == PascalTokenType_1.PascalTokenType.IDENTIFIER) {
            var name_1 = token.getText().toLowerCase();
            var constantId = ConstantDefinitionsParser.symTabStack.lookupLocal(name_1);
            // Enter the new identifier into the symbol table
            // but don't set how it's defined yet.
            if (constantId == null) {
                constantId = ConstantDefinitionsParser.symTabStack.enterLocal(name_1);
                constantId.appendLineNumber(token.getLineNumber());
            }
            else {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.IDENTIFIER_REDEFINED, this);
                constantId = null;
            }
            token = this.nextToken(); // consume the identifier token
            // Synchronize on the = token.
            token = this.synchronize(ConstantDefinitionsParser.EQUALS_SET);
            if (token.getType() == PascalTokenType_1.PascalTokenType.EQUALS) {
                token = this.nextToken(); // consume the =
            }
            else {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_EQUALS, this);
            }
            // Parse the constant value.
            var constantToken = token;
            var value = this.parseConstant(token);
            // Set identifier to be a constant and set its value.
            if (constantId != null) {
                constantId.setDefinition(DefinitionImpl_1.DefinitionImpl.CONSTANT);
                constantId.setAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE, value);
                // Set the constant's type.
                var constantType = constantToken.getType() == PascalTokenType_1.PascalTokenType.IDENTIFIER
                    ? this.getConstantType(constantToken)
                    : this.getConstantType(value);
                constantId.setTypeSpec(constantType);
            }
            token = this.currentToken();
            var tokenType = token.getType();
            // Look for one or more semicolons after a definition.
            if (tokenType == PascalTokenType_1.PascalTokenType.SEMICOLON) {
                while (token.getType() == PascalTokenType_1.PascalTokenType.SEMICOLON) {
                    token = this.nextToken(); // consume the ;
                }
            }
            else if (ConstantDefinitionsParser.NEXT_START_SET.contains(tokenType)) {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.MISSING_SEMICOLON, this);
            }
            token = this.synchronize(ConstantDefinitionsParser.IDENTIFIER_SET);
        }
        return null;
    };
    /**
     * Parse a constant value.
     * @param token the current token.
     * @return the constant value.
     * @throws Exception if an error occurred.
     */
    ConstantDefinitionsParser.prototype.parseConstant = function (token) {
        var sign = null;
        // Synchronize at the start of a constant.
        token = this.synchronize(ConstantDefinitionsParser.CONSTANT_START_SET);
        var tokenType = token.getType();
        // Plus or minus sign?
        if ((tokenType == PascalTokenType_1.PascalTokenType.PLUS) || (tokenType == PascalTokenType_1.PascalTokenType.MINUS)) {
            sign = tokenType;
            token = this.nextToken(); // consume sign
        }
        // Parse the constant.
        switch (token.getType()) {
            case PascalTokenType_1.PascalTokenType.IDENTIFIER: {
                return this.parseIdentifierConstant(token, sign);
            }
            case PascalTokenType_1.PascalTokenType.INTEGER: {
                var value = token.getValue();
                this.nextToken(); // consume the number
                return sign == PascalTokenType_1.PascalTokenType.MINUS ? -value : value;
            }
            case PascalTokenType_1.PascalTokenType.REAL: {
                var value = token.getValue();
                this.nextToken(); // consume the number
                return sign == PascalTokenType_1.PascalTokenType.MINUS ? -value : value;
            }
            case PascalTokenType_1.PascalTokenType.STRING: {
                if (sign != null) {
                    ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_CONSTANT, this);
                }
                this.nextToken(); // consume the string
                return token.getValue();
            }
            default: {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_CONSTANT, this);
                return null;
            }
        }
    };
    /**
     * Parse an identifier constant.
     * @param token the current token.
     * @param sign the sign, if any.
     * @return the constant value.
     * @throws Exception if an error occurred.
     */
    ConstantDefinitionsParser.prototype.parseIdentifierConstant = function (token, sign) {
        var name = token.getText().toLowerCase();
        var id = ConstantDefinitionsParser.symTabStack.lookup(name);
        this.nextToken(); // consume the identifier
        // The identifier must have already been defined
        // as an constant identifier.
        if (id == null) {
            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.IDENTIFIER_UNDEFINED, this);
            return null;
        }
        var definition = id.getDefinition();
        if (definition == DefinitionImpl_1.DefinitionImpl.CONSTANT) {
            var value = id.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE);
            id.appendLineNumber(token.getLineNumber());
            if (Util_1.Util.isInteger(value)) {
                return sign == PascalTokenType_1.PascalTokenType.MINUS ? -value : value;
            }
            else if (Util_1.Util.isFloat(value)) {
                return sign == PascalTokenType_1.PascalTokenType.MINUS ? -value : value;
            }
            else if (value instanceof String) {
                if (sign != null) {
                    ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_CONSTANT, this);
                }
                return value;
            }
            else {
                return null;
            }
        }
        else if (definition == DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT) {
            var value = id.getAttribute(SymTabKeyImpl_1.SymTabKeyImpl.CONSTANT_VALUE);
            id.appendLineNumber(token.getLineNumber());
            if (sign != null) {
                ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_CONSTANT, this);
            }
            return value;
        }
        else if (definition == null) {
            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.NOT_CONSTANT_IDENTIFIER, this);
            return null;
        }
        else {
            ConstantDefinitionsParser.errorHandler.flag(token, PascalErrorCode_1.PascalErrorCode.INVALID_CONSTANT, this);
            return null;
        }
    };
    /**
     * Return the type of a constant given arbitrary object.
     * @param value the constant value
     * @return the type specification.
     */
    ConstantDefinitionsParser.prototype.getConstantType = function (object) {
        if (object instanceof Token_1.Token) {
            return this.getConstantTypeByToken(object);
        }
        else {
            return this.getConstantTypeByObject(object);
        }
    };
    /**
     * Return the type of a constant given its value.
     * @param value the constant value
     * @return the type specification.
     */
    ConstantDefinitionsParser.prototype.getConstantTypeByObject = function (value) {
        var constantType = null;
        if (Util_1.Util.isInteger(value)) {
            constantType = Predefined_1.Predefined.integerType;
        }
        else if (Util_1.Util.isFloat(value)) {
            constantType = Predefined_1.Predefined.realType;
        }
        else if (value instanceof String) {
            if (value.length == 1) {
                constantType = Predefined_1.Predefined.charType;
            }
            else {
                constantType = TypeFactory_1.TypeFactory.createStringType(value);
            }
        }
        return constantType;
    };
    /**
     * Return the type of a constant given its identifier.
     * @param identifier the constant's identifier.
     * @return the type specification.
     */
    ConstantDefinitionsParser.prototype.getConstantTypeByToken = function (identifier) {
        var name = identifier.getText().toLowerCase();
        var id = ConstantDefinitionsParser.symTabStack.lookup(name);
        if (id == null) {
            return null;
        }
        var definition = id.getDefinition();
        if ((definition == DefinitionImpl_1.DefinitionImpl.CONSTANT) || (definition == DefinitionImpl_1.DefinitionImpl.ENUMERATION_CONSTANT)) {
            return id.getTypeSpec();
        }
        else {
            return null;
        }
    };
    // Synchronization set for a constant identifier.
    ConstantDefinitionsParser.IDENTIFIER_SET = DeclarationsParser_1.DeclarationsParser.TYPE_START_SET.clone();
    // Synchronization set for the start of the next definition or declaration.
    ConstantDefinitionsParser.NEXT_START_SET = DeclarationsParser_1.DeclarationsParser.TYPE_START_SET.clone();
    // Synchronization set for starting a constant.
    ConstantDefinitionsParser.CONSTANT_START_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.IDENTIFIER,
        PascalTokenType_1.PascalTokenType.INTEGER,
        PascalTokenType_1.PascalTokenType.REAL,
        PascalTokenType_1.PascalTokenType.PLUS,
        PascalTokenType_1.PascalTokenType.MINUS,
        PascalTokenType_1.PascalTokenType.STRING,
        PascalTokenType_1.PascalTokenType.SEMICOLON]);
    // Synchronization set for the = token.
    ConstantDefinitionsParser.EQUALS_SET = ConstantDefinitionsParser.CONSTANT_START_SET.clone();
    return ConstantDefinitionsParser;
}(DeclarationsParser_1.DeclarationsParser));
exports.ConstantDefinitionsParser = ConstantDefinitionsParser;
ConstantDefinitionsParser.initialize();
