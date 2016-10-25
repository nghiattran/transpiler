"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PascalParserTD_1 = require('../PascalParserTD');
var PascalTokenType_1 = require('../PascalTokenType');
var ConstantDefinitionsParser_1 = require('./ConstantDefinitionsParser');
var TypeDefinitionsParser_1 = require('./TypeDefinitionsParser');
var DeclaredRoutineParser_1 = require('./DeclaredRoutineParser');
var VariableDeclarationsParser_1 = require('./VariableDeclarationsParser');
var DefinitionImpl_1 = require('../../../intermediate/symtabimpl/DefinitionImpl');
var List_1 = require('../../../util/List');
var DeclarationsParser = (function (_super) {
    __extends(DeclarationsParser, _super);
    /**
     * Constructor.
     * @param parent the parent parser.
     */
    function DeclarationsParser(parent) {
        _super.call(this, parent);
    }
    DeclarationsParser.initialize = function () {
        DeclarationsParser.TYPE_START_SET.remove(PascalTokenType_1.PascalTokenType.CONST);
        DeclarationsParser.VAR_START_SET.remove(PascalTokenType_1.PascalTokenType.TYPE);
        DeclarationsParser.ROUTINE_START_SET.remove(PascalTokenType_1.PascalTokenType.VAR);
    };
    /**
     * Parse declarations.
     * To be overridden by the specialized declarations parser subclasses.
     * @param token the initial token.
     * @param parentId the symbol table entry of the parent routine's name.
     * @return null
     * @throws Exception if an error occurred.
     */
    DeclarationsParser.prototype.parse = function (token, parentId) {
        token = this.synchronize(DeclarationsParser.DECLARATION_START_SET);
        if (token.getType() == PascalTokenType_1.PascalTokenType.CONST) {
            token = this.nextToken(); // consume CONST
            var constantDefinitionsParser = new ConstantDefinitionsParser_1.ConstantDefinitionsParser(this);
            constantDefinitionsParser.parse(token, null);
        }
        token = this.synchronize(DeclarationsParser.TYPE_START_SET);
        if (token.getType() == PascalTokenType_1.PascalTokenType.TYPE) {
            token = this.nextToken(); // consume TYPE
            var typeDefinitionsParser = new TypeDefinitionsParser_1.TypeDefinitionsParser(this);
            typeDefinitionsParser.parse(token, null);
        }
        token = this.synchronize(DeclarationsParser.VAR_START_SET);
        if (token.getType() == PascalTokenType_1.PascalTokenType.VAR) {
            token = this.nextToken(); // consume VAR
            var variableDeclarationsParser = new VariableDeclarationsParser_1.VariableDeclarationsParser(this);
            variableDeclarationsParser.setDefinition(DefinitionImpl_1.DefinitionImpl.VARIABLE);
            variableDeclarationsParser.parse(token, null);
        }
        token = this.synchronize(DeclarationsParser.ROUTINE_START_SET);
        var tokenType = token.getType();
        while ((tokenType == PascalTokenType_1.PascalTokenType.PROCEDURE) || (tokenType == DefinitionImpl_1.DefinitionImpl.FUNCTION)) {
            var routineParser = new DeclaredRoutineParser_1.DeclaredRoutineParser(this);
            routineParser.parse(token, parentId);
            // Look for one or more semicolons after a definition.
            token = this.currentToken();
            if (token.getType() == PascalTokenType_1.PascalTokenType.SEMICOLON) {
                while (token.getType() == PascalTokenType_1.PascalTokenType.SEMICOLON) {
                    token = this.nextToken(); // consume the ;
                }
            }
            token = this.synchronize(DeclarationsParser.ROUTINE_START_SET);
            tokenType = token.getType();
        }
        return null;
    };
    DeclarationsParser.DECLARATION_START_SET = new List_1.List([
        PascalTokenType_1.PascalTokenType.CONST,
        PascalTokenType_1.PascalTokenType.TYPE,
        PascalTokenType_1.PascalTokenType.VAR,
        PascalTokenType_1.PascalTokenType.PROCEDURE,
        PascalTokenType_1.PascalTokenType.FUNCTION,
        PascalTokenType_1.PascalTokenType.BEGIN]);
    DeclarationsParser.TYPE_START_SET = DeclarationsParser.DECLARATION_START_SET.clone();
    DeclarationsParser.VAR_START_SET = DeclarationsParser.TYPE_START_SET.clone();
    DeclarationsParser.ROUTINE_START_SET = DeclarationsParser.VAR_START_SET.clone();
    return DeclarationsParser;
}(PascalParserTD_1.PascalParserTD));
exports.DeclarationsParser = DeclarationsParser;
DeclarationsParser.initialize();
