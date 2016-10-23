var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
package;
wci.frontend.pascal.parsers;
var java = .util.ArrayList;
var java = .util.EnumSet;
var wci = .frontend.;
 * ;
var wci = .frontend.pascal.;
 * ;
var wci = .intermediate.;
 * ;
var wci = .intermediate.symtabimpl.;
 * ;
var wci = .intermediate.typeimpl.;
 * ;
var static = wci.frontend.pascal.PascalTokenType.;
 * ;
var static = wci.frontend.pascal.PascalErrorCode.;
 * ;
var static = wci.intermediate.symtabimpl.SymTabKeyImpl.;
 * ;
var static = wci.intermediate.symtabimpl.DefinitionImpl.;
 * ;
var static = wci.intermediate.typeimpl.TypeFormImpl.;
 * ;
var static = wci.intermediate.typeimpl.TypeKeyImpl.;
 * ;
/**
 * <h1>ConstantDefinitionsParser</h1>
 *
 * <p>Parse Pascal constant definitions.</p>
 *
 * <p>Copyright (c) 2009 by Ronald Mak</p>
 * <p>For instructional purposes only.  No warranties.</p>
 */
var ConstantDefinitionsParser = (function (_super) {
    __extends(ConstantDefinitionsParser, _super);
    function ConstantDefinitionsParser() {
        _super.apply(this, arguments);
        /**
         * Parse constant definitions.
         * @param token the initial token.
         * @param parentId the symbol table entry of the parent routine's name.
         * @return null
         * @throws Exception if an error occurred.
         */
        this.SymTabEntry = parse(Token, token, SymTabEntry, parentId);
        this.throws = Exception;
    }
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    ConstantDefinitionsParser.prototype.ConstantDefinitionsParser = function (PascalParserTD) {
        if (PascalParserTD === void 0) { PascalParserTD = parent; }
        _super.call(this, parent);
    };
    // Synchronization set for a constant identifier.
    ConstantDefinitionsParser.final = EnumSet < PascalTokenType > IDENTIFIER_SET;
    ConstantDefinitionsParser. = {
        IDENTIFIER_SET: .add(IDENTIFIER)
    };
    // Synchronization set for starting a constant.
    ConstantDefinitionsParser.final = EnumSet < PascalTokenType > CONSTANT_START_SET;
    // Synchronization set for the = token.
    ConstantDefinitionsParser.final = EnumSet < PascalTokenType > EQUALS_SET;
    ConstantDefinitionsParser. = {
        EQUALS_SET: .add(EQUALS),
        EQUALS_SET: .add(SEMICOLON)
    };
    // Synchronization set for the start of the next definition or declaration.
    ConstantDefinitionsParser.final = EnumSet < PascalTokenType > NEXT_START_SET;
    ConstantDefinitionsParser. = {
        NEXT_START_SET: .add(SEMICOLON),
        NEXT_START_SET: .add(IDENTIFIER)
    };
    return ConstantDefinitionsParser;
}(DeclarationsParser));
{
    token = synchronize(IDENTIFIER_SET);
    // Loop to parse a sequence of constant definitions
    // separated by semicolons.
    while (token.getType() == IDENTIFIER) {
        String;
        name = token.getText().toLowerCase();
        SymTabEntry;
        constantId = symTabStack.lookupLocal(name);
        // Enter the new identifier into the symbol table
        // but don't set how it's defined yet.
        if (constantId == null) {
            constantId = symTabStack.enterLocal(name);
            constantId.appendLineNumber(token.getLineNumber());
        }
        else {
            errorHandler.flag(token, IDENTIFIER_REDEFINED, this);
            constantId = null;
        }
        token = nextToken(); // consume the identifier token
        // Synchronize on the = token.
        token = synchronize(EQUALS_SET);
        if (token.getType() == EQUALS) {
            token = nextToken(); // consume the =
        }
        else {
            errorHandler.flag(token, MISSING_EQUALS, this);
        }
        // Parse the constant value.
        Token;
        constantToken = token;
        Object;
        value = parseConstant(token);
        // Set identifier to be a constant and set its value.
        if (constantId != null) {
            constantId.setDefinition(CONSTANT);
            constantId.setAttribute(CONSTANT_VALUE, value);
            // Set the constant's type.
            TypeSpec;
            constantType =
                constantToken.getType() == IDENTIFIER
                    ? getConstantType(constantToken)
                    : getConstantType(value);
            constantId.setTypeSpec(constantType);
        }
        token = currentToken();
        TokenType;
        tokenType = token.getType();
        // Look for one or more semicolons after a definition.
        if (tokenType == SEMICOLON) {
            while (token.getType() == SEMICOLON) {
                token = nextToken(); // consume the ;
            }
        }
        else if (NEXT_START_SET.contains(tokenType)) {
            errorHandler.flag(token, MISSING_SEMICOLON, this);
        }
        token = synchronize(IDENTIFIER_SET);
    }
    return null;
}
Object;
parseConstant(Token, token);
throws;
Exception;
{
    TokenType;
    sign = null;
    // Synchronize at the start of a constant.
    token = synchronize(CONSTANT_START_SET);
    TokenType;
    tokenType = token.getType();
    // Plus or minus sign?
    if ((tokenType == PLUS) || (tokenType == MINUS)) {
        sign = tokenType;
        token = nextToken(); // consume sign
    }
    // Parse the constant.
    switch ((PascalTokenType)) {
    }
    token.getType();
    {
        IDENTIFIER: {
            return parseIdentifierConstant(token, sign);
        }
        INTEGER: {
            Integer;
            value = (Integer);
            token.getValue();
            nextToken(); // consume the number
            return sign == MINUS ? -value : value;
        }
        REAL: {
            Float;
            value = (Float);
            token.getValue();
            nextToken(); // consume the number
            return sign == MINUS ? -value : value;
        }
        STRING: {
            if (sign != null) {
                errorHandler.flag(token, INVALID_CONSTANT, this);
            }
            nextToken(); // consume the string
            return (String);
            token.getValue();
        }
        {
            errorHandler.flag(token, INVALID_CONSTANT, this);
            return null;
        }
    }
}
Object;
parseIdentifierConstant(Token, token, TokenType, sign);
throws;
Exception;
{
    String;
    name = token.getText().toLowerCase();
    SymTabEntry;
    id = symTabStack.lookup(name);
    nextToken(); // consume the identifier
    // The identifier must have already been defined
    // as an constant identifier.
    if (id == null) {
        errorHandler.flag(token, IDENTIFIER_UNDEFINED, this);
        return null;
    }
    Definition;
    definition = id.getDefinition();
    if (definition == CONSTANT) {
        Object;
        value = id.getAttribute(CONSTANT_VALUE);
        id.appendLineNumber(token.getLineNumber());
        if (value instanceof Integer) {
            return sign == MINUS ? -((Integer)) : value;
            value;
        }
        else if (value instanceof Float) {
            return sign == MINUS ? -((Float)) : value;
            value;
        }
        else if (value instanceof String) {
            if (sign != null) {
                errorHandler.flag(token, INVALID_CONSTANT, this);
            }
            return value;
        }
        else {
            return null;
        }
    }
    else if (definition == ENUMERATION_CONSTANT) {
        Object;
        value = id.getAttribute(CONSTANT_VALUE);
        id.appendLineNumber(token.getLineNumber());
        if (sign != null) {
            errorHandler.flag(token, INVALID_CONSTANT, this);
        }
        return value;
    }
    else if (definition == null) {
        errorHandler.flag(token, NOT_CONSTANT_IDENTIFIER, this);
        return null;
    }
    else {
        errorHandler.flag(token, INVALID_CONSTANT, this);
        return null;
    }
}
TypeSpec;
getConstantType(Object, value);
{
    TypeSpec;
    constantType = null;
    if (value instanceof Integer) {
        constantType = Predefined.integerType;
    }
    else if (value instanceof Float) {
        constantType = Predefined.realType;
    }
    else if (value instanceof String) {
        if (((String)))
            value;
        length() == 1;
        {
            constantType = Predefined.charType;
        }
        {
            constantType = TypeFactory.createStringType((String), value);
        }
    }
    return constantType;
}
TypeSpec;
getConstantType(Token, identifier);
{
    String;
    name = identifier.getText().toLowerCase();
    SymTabEntry;
    id = symTabStack.lookup(name);
    if (id == null) {
        return null;
    }
    Definition;
    definition = id.getDefinition();
    if ((definition == CONSTANT) || (definition == ENUMERATION_CONSTANT)) {
        return id.getTypeSpec();
    }
    else {
        return null;
    }
}
